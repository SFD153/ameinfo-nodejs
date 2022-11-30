

module.exports = {


  friendlyName: 'Generate Sitemap',


  description: 'Generate Sitemap something.',


  fn: async function () {
    await SitemapService.generate();
  }


};

