/**
 * Media.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {
      type: 'string',
      defaultsTo: '',
    },

    hash: {
      type: 'string',
      unique: true,
      defaultsTo: '',
    },

    extension: {
      type: 'string',
      defaultsTo: '',
    },

    mime: {
      type: 'string',
      defaultsTo: '',
    },

    size: {
      type: 'number',
      defaultsTo: 0,
    },

    link: {
      type: 'string',
      defaultsTo: '',
    },

    parent: {
      type: 'number',
      defaultsTo: 0,
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    pageThumbnails: {
      collection: 'page',
      via: 'thumbnail'
    },

    postThumbnails: {
      collection: 'post',
      via: 'thumbnail'
    },

    videoThumbnails: {
      collection: 'videoCategory',
      via: 'thumbnail',
    },

    postAttachments: {
      collection: 'post',
      via: 'media',
      through: 'attachment'
    },

    userAvatar: {
      collection: 'user',
      via: 'avatar'
    },

    skinAdMedia: {
      collection: 'skinAd',
      via: 'media'
    }
  },

};

