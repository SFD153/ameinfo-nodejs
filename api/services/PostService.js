const uniqid = require('uniqid');
module.exports = {
  async generateSlug(slug) {
    const posts = await Post.find({ slug: slug });

    // Check slug is exist or not
    if(!_.isEmpty(posts)) {
      slug = uniqid(`${slug}-`);
    }

    return slug;
  }
};
