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
  async rewriteSlug () {
    let start = 60000;
    let count = start;
    await Post
      .stream()
      .skip(start)
      .eachRecord(async record => {
        const posts = await knex('wp_posts')
          .where({
            post_title: record.title,
            post_status: 'publish',
          })
          .select('post_name');
        const post = _.first(posts);

        if(_.isEmpty(post)) {
          return false;
        }

        try {
          record.slug = post.post_name;
          await Post.update({ id: record.id }, record);
        } catch (e) {
          console.error(e);
          return false;
        }

        // Count number of post has been migrated
        count++;
        console.log('%s post has been rewrite slug', count);
      });
  }
}
