/**
 * TagController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Joi = require('joi');
const nestedPop = require('nested-pop');
module.exports = {


  /**
   * `TagController.find()`
   */
  find: async function (req, res) {
    let params = req.allParams();
    let query = QueryLanguageService.buildQueryCollection(params);
    let isOmitPosts =  _.get(params, 'omitPosts', false);

    try {
      let tag = await Tag.pagify(query);
      let result = EntityService.addCount(tag, 'posts', isOmitPosts);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `TagController.findOne()`
   */
  findOne: async function (req, res) {
    let query = QueryLanguageService.buildQueryModel(req.allParams());
    try {
      let result = await Tag.findOne(query.criteria, query.populates);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `TagController.count()`
   */
  count: async function (req, res) {
    let query = QueryLanguageService.buildCountQuery(req.allParams());
    try {
      let result = await Tag.count(query.criteria);
      return res.ok({ total: result });
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `TagController.create()`
   */
  create: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      name: Joi.string().required(),
      slug: Joi.string().required(),
      description: Joi.string().optional().allow('').default('')
    });

    // Validate fields
    let validation;
    try {
      validation = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    // Save one user into database
    let {
      name,
      slug,
      description
    } = validation;

    let data = {
      name: name,
      slug: slug,
      description: description
    };

    try {
      let result = await Tag.create(data).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `TagController.findOrCreate()`
   */
  findOrCreate: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      name: Joi.string().required(),
      slug: Joi.string().required(),
      description: Joi.string().optional().allow('').default('')
    });

    // Validate fields
    let validation;
    try {
      validation = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    // Save one user into database
    let {
      name,
      slug,
      description
    } = validation;

    let data = {
      name: name,
      slug: slug,
      description: description
    };

    try {
      let result = await Tag.findOrCreate({slug: slug}, data);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `TagController.update()`
   */
  update: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      id: Joi.string().required(),
      name: Joi.string().required(),
      slug: Joi.string().required(),
      description: Joi.string().optional().allow('').default('')
    });

    // Validate fields
    let validation;
    try {
      validation = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    // Save one user into database
    let {
      id,
      name,
      slug,
      description
    } = validation;

    let data = {
      name: name,
      slug: slug,
      description: description
    };

    try {
      let result = await Tag.update({id: id}, data).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   *`TagController.deleteEach()`
   */
  async deleteEach(req, res) {
    let params = req.allParams();

    // Validate field
    let schema = Joi.object().keys({
      tagsId: Joi.array().required(),
    });

    // Validate fields
    let validation;
    try {
      validation = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    // Save user to database
    let {
      tagsId
    } = validation;

    let param = {
      id: {
        in: tagsId
      }
    };

    try {
      let result = await Tag.destroy(param);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `TagController.delete()`
   */
  delete: async function (req, res) {
    let id = req.params.id;
    try {
      let result = await Tag.destroyOne(id);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  }

};

