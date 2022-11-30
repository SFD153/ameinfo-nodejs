/**
 * PostTagController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Joi = require('joi');
module.exports = {


  /**
   * `PostTagController.find()`
   */
  find: async function (req, res) {
    let { postId } = req.params;
    try {
      let result = await PostTag.find({
        where: {
          post: postId
        }
      });
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PostTagController.findOne()`
   */
  findOne: async function (req, res) {
    let { postId, tagId } = req.params;
    try {
      let result = await PostTag.findOne({
        where: {
          post: postId,
          tag: tagId
        }
      });
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PostTagController.create()`
   */
  create: async function (req, res) {
    let params = req.allParams();

    let schema = Joi.object().keys({
      postId: Joi.string().required(),
      tagId: Joi.string().required()
    });

    // Validate name and value params
    let validation;
    try {
      validation = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    let {
      postId,
      tagId
    } = validation;

    let data = {
      post: postId,
      tag: tagId
    };

    try {
      let result = await PostTag.create(data).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PostTagController.delete()`
   */
  delete: async function (req, res) {
    let { postId, tagId } = req.params;

    let params = {
      where: {
        post: postId,
        tag: tagId
      }
    };

    try {
      let result = await PostTag.destroyOne(params);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PostTagController.deleteAll()`
   */
  deleteAll: async function (req, res) {
    let { postId } = req.params;

    let params = {
      where: {
        post: postId
      }
    };

    try {
      let result = await PostTag.destroy(params);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  }

};

