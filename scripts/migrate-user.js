module.exports = {


  friendlyName: 'Migrate user',


  description: 'Migrate user database into SailsJS MongoDB',


  inputs: {

  },


  fn: async function (inputs, exits) {

    await DatabaseUserService.migrateData();

    // All done.
    return exits.success();

  }


};

