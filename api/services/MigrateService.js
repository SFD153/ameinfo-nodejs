const uniqid = require('uniqid');
module.exports = {
  async saveImageToMedia({ pathname, location }) {
    // Prepare image data for media
    let filename = _.last(pathname.split('/'));
    let extension = _.last(filename.split('.'));

    let data = {
      name: filename,
      hash: uniqid(),
      extension: extension,
      mime: `image/${extension}`,
      size: 0,
      link: `https://${location}/uploads/${pathname}`
    };

    // Add image into Media
    let media;
    try {
      media = await Media.findOrCreate({ name: filename}, data);
    } catch (e) {
      sails.log(e);
      return false;
    }

    return media.id;
  },

  getCategorySlug(slug) {
    let categories = [];
    switch (slug) {
      case 'other-money':
        categories.push('gcc');
        break;
      case 'other-construction-real-estate':
        categories.push('gcc');
        categories.push('construction-and-real-estate');
        break;
      case 'smes':
        categories.push('smb');
        break;
      case 'tag-heuer-2018':
        categories.push('startup');
        break;
      case 'banking-finance':
      case 'economy':
      case 'markets':
        categories.push('finance');
        break;
      case 'oil-gas':
      case 'power':
      case 'green-living':
        categories.push('energy');
        break;
      case 'travel':
      case 'transportation':
        categories.push('travel-tourism-and-logistics');
        break;
      case 'gadgets':
      case 'telecom':
      case 'it':
      case 'innovation':
        categories.push('technology');
        break;
      case 'insurance':
        categories.push('healthcare');
        break;
      case 'residential':
      case 'commercial':
      case 'infrastructure':
        categories.push('construction-and-real-estate');
        break;
      case 'digital':
      case 'broadcast':
      case 'print':
      case 'advertising-pr':
      case 'other-media':
        categories.push('media');
        break;
      case 'arts-culture':
      case 'iconic':
      case 'archive-luxury':
      case 'other':
      case 'lifestyle':
      case 'luxury-lifestyle':
      case 'other-lifestyle':
        categories.push('lifestyle');
        break;
      default:
        categories = [];
        break;
    }

    return categories;
  }
};
