/**
 * RoleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Joi = require('joi');
module.exports = {


  /**
   * `RoleController.find()`
   */
  find: async function (req, res) {
    let query = QueryLanguageService.buildQueryCollection(req.allParams());
    try {
      let result = await Role.pagify(query);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `RoleController.findOne()`
   */
  findOne: async function (req, res) {
    let query = QueryLanguageService.buildQueryModel(req.allParams());
    try {
      let result = await Role.findOne(query.criteria, query.populates);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `RoleController.count()`
   */
  count: async function (req, res) {
    let query = QueryLanguageService.buildCountQuery(req.allParams());
    try {
      let result = await Role.count(query.criteria);
      return res.ok({ total: result });
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `RoleController.create()`
   */
  create: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      name: Joi.string().required(),
    });

    // Validate fields
    let validation;
    try {
      validation = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    // Save term into database
    let {name} = validation;
    let data = {
      name: name,
      display: _.capitalize(name)
    };

    try {
      let result = await Role.create(data).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `RoleController.update()`
   */
  update: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      id: Joi.string().required(),
      name: Joi.string().required()
    });

    // Validate name and value params
    let validation;
    try {
      validation = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    // Save term into database
    let {id, name} = validation;
    let data = {
      name: name,
      display: _.capitalize(name)
    };

    try {
      let result = await Role.update({id: id}, data).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `RoleController.delete()`
   */
  delete: async function (req, res) {
    let id = req.params.id;
    try {
      let result = await Role.destroyOne(id);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  }

};

