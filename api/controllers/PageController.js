/**
 * PageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Joi = require('joi');
module.exports = {


  /**
   * `PageController.find()`
   */
  find: async function (req, res) {
    let query = QueryLanguageService.buildQueryCollection(req.allParams());
    try {
      let result = await Page.pagify(query);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PageController.findOne()`
   */
  findOne: async function (req, res) {
    let query = QueryLanguageService.buildQueryModel(req.allParams());
    try {
      let result = await Page.findOne(query.criteria, query.populates);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PageController.count()`
   */
  count: async function (req, res) {
    let query = QueryLanguageService.buildCountQuery(req.allParams());
    try {
      const [
        total,
        publish,
        draft,
        trash
      ] = await Promise.all([
        Page.count(query.criteria),
        Page.count({ status: 'publish' }),
        Page.count({ status: 'draft' }),
        Page.count({ status: 'trash' }),
      ]);

      return res.ok({
        total,
        publish,
        draft,
        trash,
      });
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PageController.create()`
   */
  create: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      title: Joi.string().required(),
      slug: Joi.string().required(),
      content: Joi.string().optional().allow('').default(''),
      status: Joi.string().optional().default('publish'),
      userId: Joi.string().optional().default(null),
      thumbnailId: Joi.string().optional().default(null)
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
      content,
      title,
      slug,
      status,
      userId,
      thumbnailId
    } = validation;

    let data = {
      content: content,
      title: title,
      slug: slug,
      status: status,
      user: userId,
      thumbnail: thumbnailId
    };

    try {
      let result = await Page.create(data).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PageController.update()`
   */
  update: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      id: Joi.string().required(),
      title: Joi.string().required(),
      slug: Joi.string().required(),
      content: Joi.string().optional().allow('').default(''),
      status: Joi.string().optional().default('publish'),
      userId: Joi.string().optional().default(null),
      thumbnailId: Joi.string().optional().default(null)
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
      id,
      content,
      title,
      slug,
      status,
      userId,
      thumbnailId
    } = validation;

    let data = {
      id: id,
      content: content,
      title: title,
      slug: slug,
      status: status,
      user: userId,
      thumbnail: thumbnailId
    };

    try {
      let result = await Page.update({id: id}, data).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PageController.updateStatus()`
   */
  updateStatus: async function (req, res) {
    let { pageId, statusName } = req.allParams();
    let page;

    // Find an exist post
    try {
      page = await Page.findOne(pageId);
    } catch (e) {
      return res.serverError(e);
    }

    // If not find this page
    if(_.isEmpty(page)) {
      return res.badRequest(ErrorService.responseError('this page does not exist'));
    }

    // Check status is valid or not
    const status = ['publish', 'draft', 'trash', 'pending'];
    if(!_.includes(status, statusName)) {
      return res.badRequest(ErrorService.responseError('status is not valid'));
    }

    // Set status to trash
    page.status = statusName;

    try {
      let result = await Page.update({ id: page.id }, page).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   *`PageController.deleteEach()`
   */
  async deleteEach(req, res) {
    let params = req.allParams();

    // Validate field
    let schema = Joi.object().keys({
      pagesId: Joi.array().required(),
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
      pagesId
    } = validation;

    let param = {
      id: {
        in: pagesId
      }
    };

    try {
      let result = await Page.destroy(param);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PageController.delete()`
   */
  delete: async function (req, res) {
    let id = req.params.id;
    try {
      let result = await Page.destroyOne(id);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  }

};

