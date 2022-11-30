/**
 * VideoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Joi = require('joi');
module.exports = {


  /**
   * `VideoController.find()`
   */
  find: async function (req, res) {
    let query = QueryLanguageService.buildQueryCollection(req.allParams());
    try {
      let result = await Video.pagify(query);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `VideoController.findLink()`
   */
  permalink: async function(req, res) {
    let id = req.params.id;
    try {
      let videos = await Video.find({ select: ['title', 'slug'] })
        .where({ id })
        .populate('categories');

      let result = videos.map(video => {
        video.permalink = RewriteService.permalink(video);
        return video;
      });

      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `VideoController.count()`
   */
  count: async function (req, res) {
    let query = QueryLanguageService.buildCountQuery(req.allParams());

    try {
      const [
        total,
        publish,
        schedule,
        draft,
        trash
      ] = await Promise.all([
        Video.count(query.criteria),
        Video.count({ status: 'publish' }),
        Video.count({ scheduleDate: { '>': 0 } }),
        Video.count({ status: 'draft' }),
        Video.count({ status: 'trash' }),
      ]);

      return res.ok({
        total,
        publish,
        schedule,
        draft,
        trash,
      });
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `VideoController.findOne()`
   */
  findOne: async function (req, res) {
    let query = QueryLanguageService.buildQueryModel(req.allParams());
    try {
      let result = await Video.findOne(query.criteria, query.populates);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `VideoController.lock()`
   */
  lock: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      id: Joi.string().required(),
      userId: Joi.string().optional().allow(null).default(null),
    });


    // Validate name and value params
    let validation;
    try {
      validation = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    let {
      id,
      userId,
    } = validation;

    try {
      let result = await Video.update({ id }, { lock: userId }).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `VideoController.create()`
   */
  create: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      title: Joi.string().required(),
      slug: Joi.string().required(),
      description: Joi.string().optional().allow('').default(''),
      password: Joi.string().optional().allow('').default(''),
      embedded: Joi.string().optional().allow('').default(''),
      scheduleDate: Joi.number().optional().default(0),
      status: Joi.string().optional().default('publish'),
      visibility: Joi.string().optional().default(''),
      user: Joi.string().optional().default(null),
      categoriesId: Joi.array().optional().default([]),
      tagsId: Joi.array().optional().default([]),
    });

    // Validate name and value params
    let data;
    try {
      data = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    // Save video into database
    let { slug } = data;

    // Find slug is unique or not
    try {
      data.slug = await VideoService.generateSlug(slug);
    } catch (e) {
      return res.serverError(e);
    }

    try {
      let { categoriesId, tagsId } = data;
      let result = await Video.create(data).fetch();
      await Video.addToCollection(result.id, 'categories').members(categoriesId);
      await Video.addToCollection(result.id, 'tags').members(tagsId);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `VideoController.update()`
   */
  update: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      id: Joi.string().required(),
      title: Joi.string().required(),
      slug: Joi.string().required(),
      description: Joi.string().optional().allow('').default(''),
      password: Joi.string().optional().allow('').default(''),
      embedded: Joi.string().optional().allow('').default(''),
      scheduleDate: Joi.number().optional().default(0),
      status: Joi.string().optional().default('publish'),
      visibility: Joi.string().optional().default(''),
      user: Joi.string().optional().default(null),
      categoriesId: Joi.array().optional().default([]),
      tagsId: Joi.array().optional().default([]),
    });

    // Validate name and value params
    let data;
    try {
      data = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    try {
      let { id, categoriesId, tagsId } = data;
      let result = await Video.update({ id }, data).fetch();
      await Video.replaceCollection(id, 'categories').members(categoriesId);
      await Video.replaceCollection(id, 'tags').members(tagsId);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `VideoController.updateSlug()`
   */
  updateSlug: async function (req, res) {
    let params = req.allParams();
    let { videoId, slugName } = params;

    // Find slug is unique or not
    try {
      slugName = await VideoService.generateSlug(slugName);
    } catch (e) {
      return res.serverError(e);
    }

    // Update video
    try {
      const video = await Video.update({ id: videoId }, { slug: slugName }).fetch();
      return res.ok(video);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `VideoController.updateStatus()`
   */
  updateStatus: async function (req, res) {
    let { videoId, statusName } = req.params;
    let video;

    // Find an exist video
    try {
      video = await Video.findOne(videoId);
    } catch (e) {
      return res.serverError(e);
    }

    // If not find this video
    if(_.isEmpty(video)) {
      return res.badRequest(ErrorService.responseError('this video does not exist'));
    }

    // Check status is valid or not
    const status = ['publish', 'draft', 'trash', 'pending'];
    if(!_.includes(status, statusName)) {
      return res.badRequest(ErrorService.responseError('status is not valid'));
    }

    // Set status to trash
    video.status = statusName;

    try {
      let result = await Video.update({ id: video.id }, video).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `VideoController.deleteEach()`
   */
  deleteEach: async function (req, res) {
    let params = req.allParams();

    // Validate field
    let schema = Joi.object().keys({
      videosId: Joi.array().required(),
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
      videosId
    } = validation;

    let param = {
      id: {
        in: videosId
      }
    };

    try {
      let result = await Video.destroy(param);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `VideoController.delete()`
   */
  delete: async function (req, res) {
    let id = req.params.id;
    try {
      let result = await Video.destroyOne(id);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  }

};

