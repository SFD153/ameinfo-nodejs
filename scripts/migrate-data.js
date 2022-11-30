module.exports = {


  friendlyName: 'Migrate',


  description: 'Migrate WordPress database into Sails JS MongoDB.',


  inputs: {

  },


  fn: async function (inputs, exits) {
    await DatabasePostService.migrateData();

    // All done.
    return exits.success();

  }


};

