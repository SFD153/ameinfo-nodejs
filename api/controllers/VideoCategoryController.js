/**
 * VideoCategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Joi = require('joi');
const uniqid = require('uniqid');
const ObjectID = require('bson-objectid');
module.exports = {


  /**
   * `VideoCategoryController.find()`
   */
  find: async function (req, res) {
    let query = QueryLanguageService.buildQueryCollection(req.allParams());
    try {
      let categories = await VideoCategory.pagify(query);
      let data = []
      for(const category of categories.results) {
        if(_.isObject(category.parent)) {
          if(!_.isEmpty(category.parent.parent)) {
            category.parent.parent = await VideoCategory.findOne(category.parent.parent);
          }
        }
        if(_.isArray(category.childs)) {
          let childs = [];
          for(const child of category.childs) {
            let result = await VideoCategory.findOne(child.id).populate('childs');
            childs.push(result);
          }
          category.childs = childs;
        }
        const videoCategoryAssociation = VideoCategoryAssociation.getDatastore().manager.collection(VideoCategoryAssociation.tableName);
        const count = await videoCategoryAssociation
          .aggregate([
            {
              $match: {
                categoryId: ObjectID(category.id),
              },
            },
            {
              $lookup: {
                'from': 'video',
                'localField': 'videoId',
                'foreignField': '_id',
                'as': 'video',
              }
            },
            {
              $project: {
                _id: 1,
                categoryId: 1,
                video: { '$arrayElemAt': [ '$video', 0] },
              }
            },
            {
              $match: {
                $and: [
                  { 'video.status': 'publish' },
                  { 'video.scheduleDate': 0 },
                ]
              }
            }
          ])
          .toArray();
        category.count = count.length;
        data.push(category);
      }
      categories.results = data;
      let results = categories;
      return res.ok(results);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `VideoCategoryController.findOne()`
   */
  findOne: async function (req, res) {
    let query = QueryLanguageService.buildQueryModel(req.allParams());
    try {
      let result = await VideoCategory.findOne(query.criteria, query.populates);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `VideoCategoryController.create()`
   */
  create: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      name: Joi.string().required(),
      slug: Joi.string().required(),
      description: Joi.string().optional().allow('').default(''),
      parent: Joi.string().optional().default(null),
      thumbnail: Joi.string().optional().default(null),
    });

    // Validate fields
    let data;
    try {
      data = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    // Save to database
    try {
      let result = await VideoCategory.create(data).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `VideoCategoryController.update()`
   */
  update: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      id: Joi.string().required(),
      name: Joi.string().required(),
      slug: Joi.string().required(),
      description: Joi.string().optional().allow('').default(''),
      parent: Joi.string().optional().default(null),
      thumbnail: Joi.string().optional().default(null),
    });

    // Validate fields
    let data;
    try {
      data = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    // Save to database
    try {
      let { id } = data;
      let result = await VideoCategory.update({ id }, data).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `VideoCategoryController.uniqueSlug()`
   */
  uniqueSlug: async function(req, res) {
    let slug = req.params.slug;
    const found = await VideoCategory.find({ slug });

    if(!_.isEmpty(found)) {
      slug = uniqid(`${slug}-`);
    }

    return res.send({ slug });
  },

  /**
   *`VideoCategoryController.deleteEach()`
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
      let result = await VideoCategory.destroy(param);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `VideoCategoryController.delete()`
   */
  delete: async function (req, res) {
    let id = req.params.id;
    try {
      let result = await VideoCategory.destroyOne(id);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  }

};

