/**
 * Post.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    summary: {
      type: 'string',
      defaultsTo: ''
    },

    firstKeyPoint: {
      type: 'string',
      defaultsTo: ''
    },

    secondKeyPoint: {
      type: 'string',
      defaultsTo: ''
    },

    thirdKeyPoint: {
      type: 'string',
      defaultsTo: ''
    },

    content: {
      type: 'string',
      defaultsTo: ''
    },

    title: {
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

    thumbnailCaption: {
      type: 'string',
      defaultsTo: ''
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
    lock: {
      model: 'user',
    },

    user: {
      model: 'user',
      columnName: 'userId',
    },

    thumbnail: {
      model: 'media',
      columnName: 'thumbnailId'
    },

    format: {
      model: 'format',
      columnName: 'formatId'
    },

    categories: {
      collection: 'category',
      via: 'post',
      through: 'postCategory'
    },

    tags: {
      collection: 'tag',
      via: 'post',
      through: 'postTag'
    },

    attachments: {
      collection: 'media',
      via: 'post',
      through: 'attachment'
    }
  },

  afterUpdate: async function(updatedRecord, proceed) {
    if(updatedRecord.scheduleDate === 0 && updatedRecord.status === 'publish') {
      await RedisService.deleteAll();
    }

    return proceed();
  },

  customToJSON: function() {
    this.masklink = RewriteService.permalink(this);
    return this;
  }

};

