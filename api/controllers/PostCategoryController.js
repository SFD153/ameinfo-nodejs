/**
 * PostCategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Joi = require('joi');
module.exports = {


  /**
   * `PostCategoryController.find()`
   */
  find: async function (req, res) {
    let { postId } = req.params;
    try {
      let result = await PostCategory.find({
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
   * `PostCategoryController.findOne()`
   */
  findOne: async function (req, res) {
    let { postId, categoryId } = req.params;
    try {
      let result = await PostCategory.findOne({
        where: {
          post: postId,
          category: categoryId
        }
      });
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PostCategoryController.create()`
   */
  create: async function (req, res) {
    let params = req.allParams();

    let schema = Joi.object().keys({
      postId: Joi.string().required(),
      categoryId: Joi.string().required()
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
      categoryId
    } = validation;

    let data = {
      post: postId,
      category: categoryId
    };

    try {
      let result = await PostCategory.create(data).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PostCategoryController.delete()`
   */
  delete: async function (req, res) {
    let { postId, categoryId } = req.params;

    let params = {
      where: {
        post: postId,
        category: categoryId
      }
    };

    try {
      let result = await PostCategory.destroyOne(params);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PostCategoryController.deleteAll()`
   */
  deleteAll: async function (req, res) {
    let { postId } = req.params;

    let params = {
      where: {
        post: postId
      }
    };

    try {
      let result = await PostCategory.destroy(params);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  }

};

