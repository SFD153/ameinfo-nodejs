const mysql = require('promise-mysql');
const moment = require('moment');
const parse = require('url-parse');
const { JSDOM } = require('jsdom');

module.exports = {
  async migrateData () {
    const AWS_S3_LOCATION = 'ameinfo-images.s3-ap-southeast-1.amazonaws.com';
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'ameinfo-prod'
    });

    let posts = await connection.query('SELECT * FROM wp_posts WHERE post_type="post" AND post_status="publish"');
    let count = 0;
    for ( const post of posts) {
      // Create empty post with status draft
      let postItem = await Post.create().fetch();

      // Get all categories of this post
      let categories = await connection.query(`SELECT t.slug
          FROM wp_terms t, wp_term_taxonomy tt, wp_term_relationships tr
          WHERE t.term_id=tt.term_id
          AND tt.term_taxonomy_id=tr.term_taxonomy_id
          AND tt.taxonomy="category"
          AND tr.object_id=${post.ID}
      `);

      // Get user_login by author
      let authorId = _.isEmpty(post.post_author) ? 69 : post.post_author;
      let user = await connection.query(`SELECT * FROM wp_users WHERE ID=${authorId}`);
      user = _.first(user);
      let userLogin = user.user_login.toLowerCase();
      let userInfo = await User.findOne({ username: userLogin });
      let userId = userInfo.id;

      // Get all tags of this post
      let tags = await connection.query(`SELECT t.name, t.slug
        FROM wp_terms t, wp_term_taxonomy tt, wp_term_relationships tr
        WHERE t.term_id=tt.term_id
        AND tt.term_taxonomy_id=tr.term_taxonomy_id
        AND tt.taxonomy="post_tag"
        AND tr.object_id=${post.ID}
      `);

      let tagsId = [];
      for(const tag of tags) {
        const { name, slug } = tag;
        let data = { name, slug };
        let item = await Tag.findOrCreate({ slug }, data);
        tagsId.push(item.id);

        if(slug === 'tag-heuer-2018') {
          categories.push({ slug: 'tag-heuer-2018' });
        }
      }

      // Based on category instruction to get category id of new database
      let listOfCategorySlug = [];

      categories.forEach(category => {
        listOfCategorySlug = listOfCategorySlug.concat(MigrateService.getCategorySlug(category.slug));
      });

      let categoriesId = await Category.find({ slug: listOfCategorySlug });
      categoriesId = _.map(categoriesId, 'id');


      // Get format for this post
      let formats = await connection.query(`
        SELECT t.slug
        FROM wp_terms t, wp_term_taxonomy tt, wp_term_relationships tr
        WHERE t.term_id=tt.term_id
        AND tt.term_taxonomy_id=tr.term_taxonomy_id
        AND tt.taxonomy="post_format"
        AND tr.object_id=${post.ID}
      `);

      let formatType = 'standard';
      if(!_.isEmpty(formats[0])) {
        formatType = _.get(formats[0], 'slug') === 'post-format-video' ? 'video' : formatType;
      }

      let formatId = await Format.findOne({ name: formatType });
      formatId = _.get(formatId, 'id', null);

      // Format createdAt updatedAt value for new database
      let createdAt = moment(post.post_date).valueOf() || 946684800000;
      let updatedAt = moment(post.post_modified).valueOf() || 946684800000;

      // Find all image come from wp-image
      let dom = new JSDOM(post.post_content);
      let window = dom.window;
      let images =  window.document.querySelectorAll('img[class*="wp-image-"]');

      let attachmentsId = [];
      for (const image of images) {
        // Set image to s3 bucket link
        let parsed = parse(image.getAttribute('src'));
        parsed.set('pathname', parsed.pathname.replace('/wp-content/', '/'));
        parsed.set('protocol', 'https:');
        parsed.set('hostname', AWS_S3_LOCATION);
        image.setAttribute('src', parsed);
        image.parentElement.setAttribute('href', parsed);

        // Get class name id of image from wp-image
        let className = image.className.split(' ').filter(img => img.indexOf('wp-image-') > -1).toString();
        let imageId = _.last(className.split('-'));

        // Query database to get image information from image id
        let post;
        try {
          post = await connection.query(`SELECT * FROM wp_postmeta WHERE post_id="${imageId}"`);
        } catch (e) {
          sails.log(e);
          return false;
        }

        // Check image link is found or not, if not found then using image link
        let pathname = parsed.pathname.replace('/uploads/', '');

        if(!_.isEmpty(post)) {
          let attachedFile = _.find(post, { meta_key: '_wp_attached_file' });

          if(attachedFile) {
            pathname = attachedFile.meta_value;
          }
        }

        let attachmentId = await MigrateService.saveImageToMedia({ pathname, location: AWS_S3_LOCATION });

        // Add Media Id into attachements array;
        attachmentsId.push(attachmentId);

        // Remove wordpress image id
        try {
          image.classList.remove(className);
        } catch (e) {
          console.log(e);
          console.log(className);
          console.log(post.ID);
          continue;
        }

        // Set image id after upload attachment
        image.classList.add(`image-${attachmentId}`);
      }

      // Save thumbnail into mediagetCategorySlug
      let postMeta = await connection.query(`SELECT meta_key, meta_value FROM wp_postmeta WHERE post_id = "${post.ID}"`);
      let postId = _.find(postMeta, { meta_key: '_thumbnail_id' });
      let thumbnailId = null;

      if(postId) {
        let thumbnailData = await connection.query(`SELECT meta_key, meta_value from wp_postmeta WHERE post_id = "${postId.meta_value}"`);
        let thumbnailPath = _.find(thumbnailData, { meta_key: '_wp_attached_file' });

        if(thumbnailPath) {
          thumbnailId = await MigrateService.saveImageToMedia({ pathname: thumbnailPath.meta_value, location: AWS_S3_LOCATION });
        }
      }

      let content = window.document.body.innerHTML;
      content = content.replace(/\n/g, '<br>');

      let data = {
        summary: post.post_excerpt,
        content: content,
        title: post.post_title,
        slug: post.post_name,
        status: post.post_status,
        password: post.post_password,
        createdAt: createdAt,
        updatedAt: updatedAt,
        thumbnail: thumbnailId,
        format: formatId,
        user: userId,
      };

      await Post.addToCollection(postItem.id, 'categories').members(categoriesId);
      await Post.addToCollection(postItem.id, 'tags').members(tagsId);
      await Post.addToCollection(postItem.id, 'attachments').members(attachmentsId);

      // Update post with exist id and all data
      await Post.update({ id: postItem.id }, data);

      // Count number of post has been migrated
      count++;
      console.log('%s post has been migrated', count);
    }

    connection.end();
  }
}
