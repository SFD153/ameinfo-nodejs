const slugify = require('slug');
module.exports = {


  friendlyName: 'Rewrite slug is not slugify',


  description: '',


  fn: async function () {
    let count = 0;
    await Post
      .stream()
      .sort('createdAt DESC')
      .limit(1000)
      .eachRecord(async record => {
        record.slug = slugify(record.slug);
        await Post.update({ id: record.id }, record);

        // Count number of post has been migrated
        count++;
        console.log('%s post category has been updated', count);
      });
  }


};

