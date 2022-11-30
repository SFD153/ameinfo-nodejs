module.exports = {


  friendlyName: 'Update category count',


  description: '',


  inputs: {

  },


  fn: async function (inputs, exits) {
    let categories = await Category.find().populate('posts');

    for( const category of categories ) {
      await Category.update({ id: category.id }).set({ count: category.posts.length });
    }


    // All done.
    return exits.success();

  }


};

