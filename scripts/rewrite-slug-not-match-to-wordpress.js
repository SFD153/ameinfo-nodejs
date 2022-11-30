module.exports = {


  friendlyName: 'Rewrite slug not match to wordpress',


  description: '',


  inputs: {

  },


  fn: async function (inputs, exits) {

    await RewritePostService.rewriteSlug();

    // All done.
    return exits.success();

  }


};

