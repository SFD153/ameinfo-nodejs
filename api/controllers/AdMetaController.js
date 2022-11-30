/**
 * AdMetaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Joi = require('joi');
module.exports = {


  /**
   * `AdMetaController.find()`
   */
  find: async function (req, res) {
    let query = QueryLanguageService.buildQueryCollection(req.allParams());
    try {
      let result = await AdMeta.pagify(query);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `AdMetaController.findOne()`
   */
  findOne: async function (req, res) {
    let query = QueryLanguageService.buildQueryModel(req.allParams());
    try {
      let result = await AdMeta.findOne(query.criteria, query.populates);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `AdMetaController.create()`
   */
  create: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      enableThisAd: Joi.boolean().optional().default(false),
      showOnAllSite: Joi.boolean().optional().default(false),
      showOnAllArticles: Joi.boolean().optional().default(false),
      showOnAllCategories: Joi.boolean().optional().default(false),
      showOnSelectedCategories: Joi.boolean().optional().default(false),
      showOnAllSubCategories: Joi.boolean().optional().default(false),
      showOnSelectedSubCategories: Joi.boolean().optional().default(false),
      showOnHomepage: Joi.boolean().optional().default(false),
      showOnMobile: Joi.boolean().optional().default(false),
      selectedCategories: Joi.array().optional().default([]),
      selectedSubCategories: Joi.array().optional().default([])
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
      enableThisAd,
      showOnAllSite,
      showOnAllArticles,
      showOnAllCategories,
      showOnSelectedCategories,
      showOnAllSubCategories,
      showOnSelectedSubCategories,
      showOnHomepage,
      showOnMobile,
      selectedCategories,
      selectedSubCategories
    } = validation;

    let data = {
      enableThisAd: enableThisAd,
      showOnAllSite: showOnAllSite,
      showOnAllArticles: showOnAllArticles,
      showOnAllCategories: showOnAllCategories,
      showOnSelectedCategories: showOnSelectedCategories,
      showOnAllSubCategories: showOnAllSubCategories,
      showOnSelectedSubCategories: showOnSelectedSubCategories,
      showOnHomepage: showOnHomepage,
      showOnMobile: showOnMobile,
    };

    try {
      let result = await AdMeta.create(data).fetch();
      await AdMeta.addToCollection(result.id, 'selectedCategories').members(selectedCategories);
      await AdMeta.addToCollection(result.id, 'selectedSubCategories').members(selectedSubCategories);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `AdMetaController.update()`
   */
  update: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      id: Joi.string().required(),
      enableThisAd: Joi.boolean().optional().default(false),
      showOnAllSite: Joi.boolean().optional().default(false),
      showOnAllArticles: Joi.boolean().optional().default(false),
      showOnAllCategories: Joi.boolean().optional().default(false),
      showOnSelectedCategories: Joi.boolean().optional().default(false),
      showOnAllSubCategories: Joi.boolean().optional().default(false),
      showOnSelectedSubCategories: Joi.boolean().optional().default(false),
      showOnHomepage: Joi.boolean().optional().default(false),
      showOnMobile: Joi.boolean().optional().default(false),
      selectedCategories: Joi.array().optional().default([]),
      selectedSubCategories: Joi.array().optional().default([])
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
      enableThisAd,
      showOnAllSite,
      showOnAllArticles,
      showOnAllCategories,
      showOnSelectedCategories,
      showOnAllSubCategories,
      showOnSelectedSubCategories,
      showOnHomepage,
      showOnMobile,
      selectedCategories,
      selectedSubCategories
    } = validation;

    let data = {
      id: id,
      enableThisAd: enableThisAd,
      showOnAllSite: showOnAllSite,
      showOnAllArticles: showOnAllArticles,
      showOnAllCategories: showOnAllCategories,
      showOnSelectedCategories: showOnSelectedCategories,
      showOnAllSubCategories: showOnAllSubCategories,
      showOnSelectedSubCategories: showOnSelectedSubCategories,
      showOnHomepage: showOnHomepage,
      showOnMobile: showOnMobile,
    };

    try {
      let result = await AdMeta.update({ id: id }, data).fetch();
      await AdMeta.replaceCollection(id, 'selectedCategories').members(selectedCategories);
      await AdMeta.replaceCollection(id, 'selectedSubCategories').members(selectedSubCategories);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `AdMetaController.deleteEach()`
   */
  deleteEach: async function (req, res) {
    let params = req.allParams();

    // Validate field
    let schema = Joi.object().keys({
      adsId: Joi.array().required(),
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
      adsId
    } = validation;

    let param = {
      id: {
        in: adsId
      }
    };

    try {
      let result = await AdMeta.destroy(param);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `AdMetaController.delete()`
   */
  delete: async function (req, res) {
    let id = req.params.id;
    try {
      let result = await AdMeta.destroyOne(id);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  }

};

