module.exports = {


  friendlyName: 'Add lock attribute to post',


  description: '',


  inputs: {

  },


  fn: async function (inputs, exits) {
    let count = 1;
    await Post
      .stream()
      .limit(1)
      .eachRecord(async post => {
        console.log(post);
        try {
          await Post.update({ id: post.id }, { embedded: '' });
          console.log('Post has added attribute: %s', count);
          count++;
        } catch (e) {
          console.error(e);
          process.exit(1);
        }
      });

    // All done.
    return exits.success();

  }


};

