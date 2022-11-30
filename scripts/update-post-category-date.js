module.exports = {


  friendlyName: 'Update post category date',


  description: '',


  inputs: {

  },


  fn: async function (inputs, exits) {
    let count = 0;
    await PostCategory
      .stream()
      .eachRecord(async postCategory => {
        const postId = postCategory.post;
        const post = await Post.findOne({ id: postId });
        postCategory.createdAt = post.createdAt || 946684800000;
        postCategory.updatedAt = post.updatedAt || 946684800000;
        await PostCategory.update({ id: postCategory.id }, postCategory);

        // Count number of post has been migrated
        count++;
        console.log('%s post category has been updated', count);
      });


    // All done.
    return exits.success();

  }


};

