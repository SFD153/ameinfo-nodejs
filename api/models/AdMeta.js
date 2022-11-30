/**
 * AdMeta.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    enableThisAd: {
      type: 'boolean',
      defaultsTo: false
    },

    showOnAllSite: {
      type: 'boolean',
      defaultsTo: false
    },

    showOnAllArticles: {
      type: 'boolean',
      defaultsTo: false
    },

    showOnAllCategories: {
      type: 'boolean',
      defaultsTo: false
    },

    showOnSelectedCategories: {
      type: 'boolean',
      defaultsTo: false,
    },

    showOnAllSubCategories: {
      type: 'boolean',
      defaultsTo: false
    },

    showOnSelectedSubCategories: {
      type: 'boolean',
      defaultsTo: false,
    },

    showOnHomepage: {
      type: 'boolean',
      defaultsTo: false
    },

    showOnMobile: {
      type: 'boolean',
      defaultsTo: false,
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    selectedCategories: {
      collection: 'category',
      via: 'meta',
      through: 'adMetaSelectedCategories'
    },

    selectedSubCategories: {
      collection: 'category',
      via: 'meta',
      through: 'adMetaSelectedSubCategories'
    },

    ads: {
      collection: 'ad',
      via: 'meta'
    },

    skinAds: {
      collection: 'skinAd',
      via: 'meta'
    },
  },

};

