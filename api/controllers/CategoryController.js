/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Joi = require('joi');
module.exports = {


  /**
   * `CategoryController.find()`
   */
  find: async function (req, res) {
    let query = QueryLanguageService.buildQueryCollection(req.allParams());
    try {
      let result = await Category.pagify(query);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `CategoryController.findOptimization()`
   */
  findOptimization: async function (req, res) {
    const { limit } = req.allParams();
    let limitCategories = _.isEmpty(limit) ? 8 : limit;

    try {
      let categories = await Category.find({ select: ['name', 'slug', 'parent'] })
        .where({
          slug: {
            in: ['healthcare', 'energy', 'smb', 'technology', 'gcc', 'finance', 'media', 'startup']
          }
        })
        .limit(limitCategories)
        .populate('posts', {
          sort: 'createdAt DESC',
          select: ['title', 'slug', 'thumbnail', 'format', 'createdAt'],
          limit: 5,
          where: {
            status: 'publish'
          }
        });

      let result = await Promise.all(categories.map(async category => {
        let posts = await Promise.all(category.posts.map(async post => {
          post.thumbnail = await Media.findOne({ id: post.thumbnail });
          let format = await Format.findOne({ id: post.format });
          post.format = format.name;
          return post;
        }));
        category.posts = posts;
        return category;
      }));

      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `CategoryController.findOne()`
   */
  findOne: async function (req, res) {
    let query = QueryLanguageService.buildQueryModel(req.allParams());
    try {
      let result = await Category.findOne(query.criteria, query.populates);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `CategoryController.parent()`
   */
  parent: async function (req, res) {
    try {
      let result = await Category
        .find({ select: ['name', 'slug']})
        .where({ parent: null });
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `CategoryController.count()`
   */
  count: async function (req, res) {
    let query = QueryLanguageService.buildCountQuery(req.allParams());
    try {
      let result = await Category.count(query.criteria);
      return res.ok({ total: result });
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `CategoryController.create()`
   */
  create: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      name: Joi.string().required(),
      slug: Joi.string().required(),
      parent: Joi.string().optional().default(null),
      description: Joi.string().optional().allow('').default(''),
      title: Joi.string().optional().allow('').default('')
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
      title,
      parent,
      description
    } = validation;

    let data = {
      name: name,
      slug: slug,
      title: title,
      parent: parent,
      description: description
    };

    try {
      let result = await Category.create(data).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `CategoryController.update()`
   */
  update: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      id: Joi.string().required(),
      name: Joi.string().required(),
      slug: Joi.string().required(),
      parent: Joi.string().optional().default(null),
      description: Joi.string().optional().allow('').default(''),
      title: Joi.string().optional().allow('').default('')
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
      title,
      parent,
      description
    } = validation;

    let data = {
      name: name,
      slug: slug,
      title: title,
      parent: parent,
      description: description
    };

    try {
      let result = await Category.update({id: id}, data).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   *`CategoryController.deleteEach()`
   */
  async deleteEach(req, res) {
    let params = req.allParams();

    // Validate field
    let schema = Joi.object().keys({
      categoriesId: Joi.array().required(),
    });

    let validation;
    try {
      validation = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    // Save user to database
    let {
      categoriesId
    } = validation;

    let param = {
      id: {
        in: categoriesId
      }
    };

    try {
      let result = await Category.destroy(param);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `CategoryController.delete()`
   */
  delete: async function (req, res) {
    let id = req.params.id;
    try {
      let result = await Category.destroyOne(id);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  }

};

