/**
 * Video.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    title: {
      type: 'string',
      defaultsTo: ''
    },

    description: {
      type: 'string',
      defaultsTo: ''
    },

    status: {
      type: 'string',
      defaultsTo: 'draft'
    },

    visibility: {
      type: 'string',
      defaultsTo: ''
    },

    password: {
      type: 'string',
      defaultsTo: ''
    },

    slug: {
      type: 'string',
      unique: true,
      defaultsTo: '',
    },

    embedded: {
      type: 'string',
      defaultsTo: ''
    },

    scheduleDate: {
      type: 'number',
      defaultsTo: 0
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    lock: {
      model: 'user',
    },

    user: {
      model: 'user',
      columnName: 'userId',
    },

    categories: {
      collection: 'videoCategory',
      via: 'video',
      through: 'videoCategoryAssociation'
    },

    tags: {
      collection: 'videoTag',
      via: 'video',
      through: 'videoTagAssociation'
    },
  },
  customToJSON: function() {
    this.thumbnail = _.isEmpty(this.embedded) ? null : VideoService.getYoutubeThumbnail(this.embedded);
    return this;
  }
};

