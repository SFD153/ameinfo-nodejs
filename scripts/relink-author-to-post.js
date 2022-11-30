module.exports = {


  friendlyName: 'Relink author to post',


  description: '',


  inputs: {

  },


  fn: async function (inputs, exits) {

    await AuthorPostService.relink();

    // All done.
    return exits.success();

  }


};

