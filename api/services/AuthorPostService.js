const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : '',
    database : 'ameinfo-prod'
  }
});

module.exports = {
  async relink () {
    // Counter
    let count = 0;

    // FETCH Mongodb Post
    await Post
      .stream()
      .eachRecord(async(post) => {
        // Using slug to find MySQL Post
        let postWP = await knex('wp_posts')
          .where({ post_name: post.slug })
          .select('post_author');
        postWP = _.first(postWP);

        // Skip post does not exist
        if(_.isEmpty(postWP)) {
          return false;
        }

        // Skip user does not valid
        let author = postWP.post_author;
        if(author <= 0) {
          return false;
        }

        // Using post_author to find MySQL user
        let authorWP = await knex('wp_users')
          .where({ ID: postWP.post_author })
          .select('user_email');
        authorWP = _.first(authorWP);

        // Skip user does not exist
        if(_.isEmpty(authorWP)) {
          return false;
        }

        // Using email to find MongoDB user
        const userEmail = authorWP.user_email.toLowerCase();
        let user;
        try {
          user = await User.findOne({ email: userEmail });
        } catch (e) {
          console.error(e);
          process.exit(1);
        }

        // Update user with MongoDB user ID
        post.user = user.id;
        try {
          await Post.update({ id: post.id }, post);
        } catch (e) {
          console.error(e);
          process.exit(1);
        }

        // Count number of post has been migrated
        count++;
        console.log('%s post has been migrated', count);
      });

  }
};
