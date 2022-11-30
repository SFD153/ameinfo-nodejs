const Sitemap = require('sitemap2');
const host = 'https://www.ameinfo.com';
const sitemap = new Sitemap({ hostName: host });
const S3 = require('aws-sdk/clients/s3');
const s3 = new S3({
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: "AKIAJ5IAPCALOLDBFHYQ",
    secretAccessKey: "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",
  }
});

module.exports = {
  async generate() {
    // GENERATE CATEGORY SITEMAP
    const categories = await Category.find().populate('parent');
    const categorySitemap = new Sitemap({ hostName: host, fileName: 'sitemap-category.xml' });
    for ( const category of categories ) {
      let url;

      if(category.parent) {
        url = category.parent.slug + '/' + category.slug;
      } else {
        url = category.slug;
      }

      // Not correctly url then skip
      if(!url) {
        continue;
      }

      // Url contain undefined word then skip
      if(url.indexOf('undefined') > -1) {
        continue;
      }

      // Add url into sitemap
      try {
        categorySitemap.addUrl(`${host}/${url}`);
      } catch (e) {
        console.log(e);
        process.exit(1);
      }
    }

    // Add Category to sitemap
    sitemap.addSitemap(categorySitemap);

    // GENERATE PAGE SITEMAP
    const pageSitemap = new Sitemap({ hostName: host, fileName: 'sitemap-page.xml' });
    const pages = await Page.find({ status: 'publish' });

    for( const page of pages ) {
      pageSitemap.addUrl(`${host}/${page.slug}`);
    }

    // Add Page to sitemap
    sitemap.addSitemap(pageSitemap);

    // GENERATE POST SITEMAP
    let count = 0;
    for( const category of categories ) {
      if(!_.get(category, 'parent') && category.slug !== 'lifestyle') {
        continue;
      }

      if(category.parent) {
        const skipCategories = ['country', 'sectors'];

        // Continue if parent include these categories
        if(skipCategories.includes(category.parent.slug)) {
          continue;
        }
      }

      const LIMIT = 1000;
      let totalOfPost = await PostCategory
        .count({
          status: 'publish',
          category: category.id
        });

      if(totalOfPost < 1000) {
        totalOfPost = 1;
      } else {
        totalOfPost = parseInt(totalOfPost / LIMIT);
        totalOfPost = totalOfPost + 1;
      }

      for(let i=0; i<totalOfPost; i++) {
        let postSitemap = new Sitemap({ hostName: host, fileName: `sitemap-${category.slug}.xml`});

        if(i>0) {
          postSitemap = new Sitemap({ hostName: host, fileName: `sitemap-${category.slug}-${i}.xml` });
        }

        // Fetch all posts
        const posts = await PostCategory
          .find({
            status: 'publish',
            category: category.id,
          })
          .skip(LIMIT * i)
          .limit(LIMIT)
          .populate('post');

        // If there is no posts and then break
        if(_.isEmpty(posts)) {
          break;
        }


        // Add post to sitemap
        for ( const item of posts ) {
          // Skip if post does not have slug
          if(!item.post.slug) {
            continue;
          }
          
          // Only lifestyle category does not have parent slug
          let slug;
          if(category.slug === 'lifestyle') {
            slug = category.slug + '/' + item.post.slug;
          } else {
            slug = category.parent.slug + '/' + category.slug + '/' + item.post.slug;
          }

          try {
            postSitemap.addUrl(`${host}/${slug}`);
          } catch (e) {
            console.log(e);
            process.exit(1);
          }

          // Track number of post has done
          console.log('Post has added to sitemap: %s', count);
          count++;
        }

        // Add post sitemap into parent sitemap
        try {
          sitemap.addSitemap(postSitemap);
        } catch (e) {
          console.log(e);
          process.exit(1);
        }
      }
    }

    // Save each sitemap file into s3
    const files = sitemap.toXML();

    for(const file of files) {
      try {
        await s3
          .putObject({
            Bucket: 'ameinfo-public',
            Key: file.fileName,
            Body: file.xml,
            ContentType: 'text/xml',
          })
          .promise();
      } catch (e) {
        console.log(e);
      }
    }
  }
};
