/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    username: {
      type: 'string',
      unique: true,
      defaultsTo: '',
    },

    password: {
      type: 'string',
      defaultsTo: '',
    },

    email: {
      type: 'string',
      unique: true,
      defaultsTo: '',
    },

    firstName: {
      type: 'string',
      defaultsTo: '',
    },

    lastName: {
      type: 'string',
      defaultsTo: '',
    },

    biographicalInfo: {
      type: 'string',
      defaultsTo: '',
    },

    activationKey: {
      type: 'string',
      defaultsTo: '',
    },

    status: {
      type: 'number',
      defaultsTo: 0,
    },
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    posts: {
      collection: 'post',
      via: 'user'
    },

    videos: {
      collection: 'video',
      via: 'user',
    },

    pages: {
      collection: 'page',
      via: 'user'
    },

    role: {
      model: 'role',
      columnName: 'roleId'
    },

    avatar: {
      model: 'media',
      columnName: 'avatarId'
    }
  },

  customToJSON: function() {
    let name = `${this.firstName} ${this.lastName}`;
    if (!this.firstName && !this.lastName) {
      name = 'AMEInfo Staff';
    }
    this.fullName = name.trim();
    return _.omit(this, ['password']);
  },
};

