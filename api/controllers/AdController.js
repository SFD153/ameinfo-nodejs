/**
 * AdController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Joi = require('joi');
module.exports = {


  /**
   * `AdController.find()`
   */
  find: async function (req, res) {
    let query = QueryLanguageService.buildQueryCollection(req.allParams());
    try {
      let result = await Ad.pagify(query);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `AdController.findOne()`
   */
  findOne: async function (req, res) {
    let params = req.allParams();
    let query = QueryLanguageService.buildQueryModel(params);

    // Find ads based on show on
    if(_.get(query, 'criteria.where.slug')) {
      query.criteria.where = { showOn: params.id };
    }

    try {
      let result = await Ad.findOne(query.criteria, query.populates);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `AdController.count()`
   */
  count: async function (req, res) {
    let query = QueryLanguageService.buildCountQuery(req.allParams());
    try {
      let result = await Ad.count(query.criteria);
      return res.ok({ total: result });
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `AdController.placement()`
   */
  placement: async function(req, res) {
    let showOn = [];
    let base = ['home', 'post'];

    // Get current showon
    try {
      let ads = await Ad.find();
      showOn = ads.map(ad => ad.showOn);
      showOn = showOn.filter(ad => !_.isEmpty(ad));
    } catch (e) {
      return res.serverError(e);
    }

    try {
      let categories = await Category.find();
      let slugs = categories.map(category => category.slug);
      let results = [...base, ...slugs];

      // Remove placement which already show on
      showOn.forEach(item => {
        const index = results.indexOf(item);
        if(index > -1) {
          results.splice(index, 1);
        }
      });

      return res.ok({ results });
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `AdController.create()`
   */
  create: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      size: Joi.string().optional().allow('').default(''),
      name: Joi.string().required(),
      description: Joi.string().optional().allow('').default(''),
      adUnitPath: Joi.string().optional().allow('').default(''),
      script: Joi.string().required(),
      showOn: Joi.string().required(),
      metaId: Joi.string().optional().default(null),
    });

    // Validate fields
    let data;
    try {
      data = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    try {
      let result = await Ad.create(data).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `AdController.update()`
   */
  update: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      id: Joi.string().required(),
      size: Joi.string().optional().allow('').default(''),
      name: Joi.string().required(),
      description: Joi.string().optional().allow('').default(''),
      adUnitPath: Joi.string().optional().allow('').default(''),
      script: Joi.string().required(),
      showOn: Joi.string().required(),
      metaId: Joi.string().optional().default(null),
    });

    // Validate fields
    let data;
    try {
      data = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    // Save data into database
    try {
      let result = await Ad.update({id: data.id}, data).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `AdController.deleteEach()`
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
      let result = await Ad.destroy(param);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `AdController.delete()`
   */
  delete: async function (req, res) {
    let id = req.params.id;
    try {
      let result = await Ad.destroyOne(id);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  }

};

