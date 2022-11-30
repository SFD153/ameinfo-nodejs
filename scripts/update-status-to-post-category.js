module.exports = {


  friendlyName: 'Update status to post category',


  description: '',


  inputs: {

  },


  fn: async function (inputs, exits) {
    await PostCategoryService.addStatus();

    // All done.
    return exits.success();

  }


};

