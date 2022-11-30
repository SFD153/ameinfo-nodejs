/**
 * SkinAdController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Joi = require('joi');
module.exports = {


  /**
   * `SkinAdController.find()`
   */
  find: async function (req, res) {
    let query = QueryLanguageService.buildQueryCollection(req.allParams());
    try {
      let result = await SkinAd.pagify(query);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `SkinAdController.findOne()`
   */
  findOne: async function (req, res) {
    let query = QueryLanguageService.buildQueryModel(req.allParams());
    try {
      let result = await SkinAd.findOne(query.criteria, query.populates);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `SkinAdController.count()`
   */
  count: async function (req, res) {
    let query = QueryLanguageService.buildCountQuery(req.allParams());
    try {
      let result = await SkinAd.count(query.criteria);
      return res.ok({ total: result });
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `SkinAdController.create()`
   */
  create: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string().optional().allow('').default(''),
      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
      topMargin: Joi.string().optional().allow('').default(''),
      skinUrl: Joi.string().optional().allow('').default(''),
      mediaId: Joi.string().required(),
      meta: Joi.object().required()
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
      description,
      startDate,
      endDate,
      topMargin,
      skinUrl,
      mediaId,
      meta
    } = validation;

    let data = {
      name: name,
      description: description,
      startDate: startDate,
      endDate: endDate,
      topMargin: topMargin,
      skinUrl: skinUrl,
      media: mediaId,
      meta: meta,
    };

    try {
      let adMeta = await AdMeta.create(meta).fetch();
      data.meta = adMeta.id;
      let result = await SkinAd.create(data).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `SkinAdController.update()`
   */
  update: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      id: Joi.string().required(),
      name: Joi.string().required(),
      description: Joi.string().optional().allow('').default(''),
      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
      topMargin: Joi.string().optional().allow('').default(''),
      skinUrl: Joi.string().optional().allow('').default(''),
      mediaId: Joi.string().required(),
      meta: Joi.object().required()
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
      description,
      startDate,
      endDate,
      topMargin,
      skinUrl,
      mediaId,
      meta
    } = validation;

    let data = {
      id: id,
      name: name,
      description: description,
      startDate: startDate,
      endDate: endDate,
      topMargin: topMargin,
      skinUrl: skinUrl,
      media: mediaId,
      meta: meta,
    };

    try {
      let adMeta = await AdMeta.update({id: meta.id}, meta).fetch();
      data.meta = adMeta.id;
      let result = await SkinAd.update({id: id}, data).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `SkinAdController.deleteEach()`
   */
  deleteEach: async function (req, res) {
    let params = req.allParams();

    // Validate field
    let schema = Joi.object().keys({
      skinAdsId: Joi.array().required(),
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
      skinAdsId
    } = validation;

    let param = {
      id: {
        in: skinAdsId
      }
    };

    try {
      let result = await SkinAd.destroy(param);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `SkinAdController.delete()`
   */
  delete: async function (req, res) {
    let id = req.params.id;
    try {
      let result = await SkinAd.destroyOne(id);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  }

};

