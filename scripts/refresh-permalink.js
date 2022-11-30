module.exports = {


  friendlyName: 'Refresh permalink',


  description: '',


  fn: async function () {

    await PermalinkService.build();

  }


};

