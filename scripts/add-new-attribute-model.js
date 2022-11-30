module.exports = {


  friendlyName: 'Add new attribute model',


  description: '',


  fn: async function (inputs, exits) {
    let count = 1;
    await Post
      .stream()
      .eachRecord(async item => {
        try {
          await Post.update({ id: item.id }, { type: 'post' });
          console.log('Item has added attribute: %s', count);
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

