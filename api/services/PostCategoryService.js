module.exports = {
  async addStatus () {
    // Counter
    let count = 0;

    // Get list of post category
    await PostCategory
      .stream()
      .eachRecord(async postCategory => {
        // Get post id
        let post
        try {
          post = await Post.findOne({ id: postCategory.post });
        } catch (e) {
          console.error(e);
          process.exit(1);
        }

        // Add status field
        postCategory.status = post.status;

        // Update current post category
        try {
          await PostCategory.update({ id: postCategory.id }, postCategory);
        } catch (e) {
          console.error(e);
          process.exit(1);
        }

        // Count number of post has been migrated
        count++;
        console.log('%s post has been updated', count);
      });

  }
};
