/**
 * SettingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Joi = require('joi');
module.exports = {


  /**
   * `SettingController.find()`
   */
  find: async function (req, res) {
    let query = QueryLanguageService.buildQueryCollection(req.allParams());
    try {
      let result = await Setting.pagify(query);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `SettingController.findOne()`
   */
  findOne: async function (req, res) {
    let query = QueryLanguageService.buildQueryModel(req.allParams());
    try {
      let result = await Setting.findOne(query.criteria, query.populates);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `SettingController.count()`
   */
  count: async function (req, res) {
    let query = QueryLanguageService.buildCountQuery(req.allParams());
    try {
      let result = await Setting.count(query.criteria);
      return res.ok({ total: result });
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `SettingController.create()`
   */
  create: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      name: Joi.string().required(),
      value: Joi.string().optional().allow('').default(''),
    });

    // Validate name and value params
    let validation;
    try {
      validation = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    // Save post into database
    let {
      name,
      value
    } = validation;
    let data = {
      name: name,
      value: value
    };

    try {
      let result = await Setting.create(data).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `SettingController.featuredGeneralRefresh()`
   */
  async featuredGeneralRefresh(req, res) {
    try {
      await SettingService.featuredGeneralRefresh();
      return res.ok({ message: 'successfully' });
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   *`SettingController.updateEach()`
   */
  async updateEach(req, res) {
    let settings = req.body;
    let results = [];
    for (const setting of settings) {
      let params = setting;

      let schema = Joi.object().keys({
        id: Joi.string().required(),
        name: Joi.string().required(),
        value: Joi.string().optional().allow('').default('')
      });

      // Validate name and value params
      let validation;
      try {
        validation = await Joi.validate(params, schema);
      } catch (e) {
        return res.badValidation(e);
      }

      // Save post into database
      let {id, name, value} = validation;
      let data = {
        name: name,
        value: value
      };

      try {
        let result = await Setting.update({id: id}, data).fetch();
        results.push(result[0]);
      } catch (e) {
        return res.serverError(e);
      }
    }

    return res.ok(results);
  },

  /**
   * `SettingController.update()`
   */
  update: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      id: Joi.string().required(),
      name: Joi.string().required(),
      value: Joi.string().optional().allow('').default('')
    });

    // Validate name and value params
    let validation;
    try {
      validation = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    // Save post into database
    let {id, name, value} = validation;
    let data = {
      name: name,
      value: value
    };

    try {
      let result = await Setting.update({id: id}, data).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `SettingController.delete()`
   */
  delete: async function (req, res) {
    let id = req.params.id;
    try {
      let result = await Setting.destroyOne(id);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  }

};

