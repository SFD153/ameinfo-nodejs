/**
 * Category.js
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

    slug: {
      type: 'string',
      unique: true,
      defaultsTo: '',
    },

    description: {
      type: 'string',
      defaultsTo: '',
    },

    title: {
      type: 'string',
      defaultsTo: '',
    },

    count: {
      type: 'number',
      defaultsTo: 0,
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    parent: {
      model: 'category'
    },

    childs: {
      collection: 'category',
      via: 'parent'
    },

    posts: {
      collection: 'post',
      via: 'category',
      through: 'postCategory'
    },

    selectedCategories: {
      collection: 'adMeta',
      via: 'category',
      through: 'adMetaSelectedCategories'
    },

    selectedSubCategories: {
      collection: 'adMeta',
      via: 'subCategory',
      through: 'adMetaSelectedSubCategories'
    }

  },

};

