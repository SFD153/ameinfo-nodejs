/**
 * PostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Joi = require('joi');
const nestedPop = require('nested-pop');
module.exports = {


  /**
   * `PostController.find()`
   */
  find: async function (req, res) {
    let query = QueryLanguageService.buildQueryCollection(req.allParams());
    try {
      let result = await Post.pagify(query);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PostController.findOne()`
   */
  findOne: async function (req, res) {
    let query = QueryLanguageService.buildQueryModel(req.allParams());
    try {
      let result = await Post.findOne(query.criteria, query.populates);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PostController.findLink()`
   */
  permalinkAll: async function(req, res) {
    let id = req.body.id;
    try {
      let posts = await Post.find({ select: ['title', 'slug'] })
        .where({ id: id })
        .populate('categories');

      let result = posts.map(post => {
        post.permalink = RewriteService.permalink(post);
        return post;
      });

      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PostController.permakink()`
   */
  permalink: async function(req, res) {
    let id = req.params.id;
    try {
      let result = await Post
        .findOne({ select: ['title', 'slug'] })
        .where({ id: id })
        .populate('categories');
      if(result) {
        result.permalink = RewriteService.permalink(result);
      }
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PostController.count()`
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
        Post.count(query.criteria),
        Post.count({ status: 'publish' }),
        Post.count({ scheduleDate: { '>': 0 } }),
        Post.count({ status: 'draft' }),
        Post.count({ status: 'trash' }),
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
   * `PostController.findPostByCategoryId()`
   */
  findPostByCategoryId: async function (req, res) {
    let params = {
      select: 'post',
      where: {
        category: req.params.categoryId
      }
    };

    let nestedOptions = {
      post: [
        'user',
        'categories',
        'tags'
      ]
    };

    try {
      let postCategories = await PostCategory.find(params).populate('post');
      let posts = await nestedPop(postCategories, nestedOptions);
      posts = posts.map(collection => collection.post);
      return res.ok(posts);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PostController.lock()`
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
      let result = await Post.update({ id }, { lock: userId }).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PostController.create()`
   */
  create: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      title: Joi.string().required(),
      slug: Joi.string().required(),
      summary: Joi.string().optional().allow('').default(''),
      firstKeyPoint: Joi.string().optional().allow('').default(''),
      secondKeyPoint: Joi.string().optional().allow('').default(''),
      thirdKeyPoint: Joi.string().optional().allow('').default(''),
      content: Joi.string().optional().allow('').default(''),
      password: Joi.string().optional().allow('').default(''),
      thumbnailCaption: Joi.string().optional().allow('').default(''),
      embedded: Joi.string().optional().allow('').default(''),
      scheduleDate: Joi.number().optional().default(0),
      status: Joi.string().optional().default('publish'),
      visibility: Joi.string().optional().default(''),
      userId: Joi.string().optional().default(null),
      thumbnailId: Joi.string().optional().default(null),
      formatId: Joi.string().optional().default(null),
      categoriesId: Joi.array().optional().default([]),
      tagsId: Joi.array().optional().default([]),
      attachmentsId: Joi.array().optional().default([])
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
      summary,
      firstKeyPoint,
      secondKeyPoint,
      thirdKeyPoint,
      content,
      title,
      slug,
      password,
      thumbnailCaption,
      embedded,
      scheduleDate,
      status,
      visibility,
      userId,
      thumbnailId,
      formatId,
      categoriesId,
      tagsId,
      attachmentsId
    } = validation;

    // Find slug is unique or not
    try {
      slug = await PostService.generateSlug(slug);
    } catch (e) {
      return res.serverError(e);
    }

    let data = {
      summary: summary,
      firstKeyPoint: firstKeyPoint,
      secondKeyPoint: secondKeyPoint,
      thirdKeyPoint: thirdKeyPoint,
      content: content,
      title: title,
      slug: slug,
      status: status,
      visibility: visibility,
      password: password,
      thumbnailCaption: thumbnailCaption,
      embedded: embedded,
      scheduleDate: scheduleDate,
      user: userId,
      thumbnail: thumbnailId,
      format: formatId,
    };

    try {
      let result = await Post.create(data).fetch();

      for (const categoryId of categoriesId) {
        await PostCategory.create({ post: result.id, category: categoryId });
      }

      // await Post.addToCollection(result.id, 'categories').members(categoriesId);
      await Post.addToCollection(result.id, 'tags').members(tagsId);
      await Post.addToCollection(result.id, 'attachments').members(attachmentsId);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PostController.update()`
   */
  update: async function (req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      id: Joi.string().required(),
      title: Joi.string().required(),
      slug: Joi.string().required(),
      summary: Joi.string().optional().allow('').default(''),
      firstKeyPoint: Joi.string().optional().allow('').default(''),
      secondKeyPoint: Joi.string().optional().allow('').default(''),
      thirdKeyPoint: Joi.string().optional().allow('').default(''),
      content: Joi.string().optional().allow('').default(''),
      password: Joi.string().optional().allow('').default(''),
      thumbnailCaption: Joi.string().optional().allow('').default(''),
      embedded: Joi.string().optional().allow('').default(''),
      scheduleDate: Joi.number().optional().default(0),
      status: Joi.string().optional().default('publish'),
      visibility: Joi.string().optional().default(''),
      userId: Joi.string().optional().default(null),
      thumbnailId: Joi.string().optional().default(null),
      formatId: Joi.string().optional().default(null),
      categoriesId: Joi.array().optional().default([]),
      tagsId: Joi.array().optional().default([]),
      attachmentsId: Joi.array().optional().default([])
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
      summary,
      firstKeyPoint,
      secondKeyPoint,
      thirdKeyPoint,
      content,
      title,
      slug,
      password,
      thumbnailCaption,
      embedded,
      scheduleDate,
      status,
      visibility,
      userId,
      thumbnailId,
      formatId,
      categoriesId,
      tagsId,
      attachmentsId
    } = validation;

    let data = {
      id: id,
      summary: summary,
      firstKeyPoint: firstKeyPoint,
      secondKeyPoint: secondKeyPoint,
      thirdKeyPoint: thirdKeyPoint,
      content: content,
      title: title,
      slug: slug,
      password: password,
      thumbnailCaption: thumbnailCaption,
      embedded: embedded,
      scheduleDate: scheduleDate,
      status: status,
      visibility: visibility,
      user: userId,
      thumbnail: thumbnailId,
      format: formatId
    };

    try {
      let result = await Post.update({id: id}, data).fetch();
      await PostCategory.destroy({ post: id });

      for (const categoryId of categoriesId) {
        await PostCategory.create({ post: id, category: categoryId });
      }

      // await Post.replaceCollection(id, 'categories').members(categoriesId);
      await Post.replaceCollection(id, 'tags').members(tagsId);
      await Post.replaceCollection(id, 'attachments').members(attachmentsId);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PostController.updateSlug()`
   */
  updateSlug: async function (req, res) {
    let params = req.allParams();
    let { postId, slugName } = params;

    // Find slug is unique or not
    try {
      slugName = await PostService.generateSlug(slugName);
    } catch (e) {
      return res.serverError(e);
    }

    // Update post
    try {
      const post = await Post.update({ id: postId }, { slug: slugName }).fetch();
      return res.ok(post);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PostController.updateStatus()`
   */
  updateStatus: async function (req, res) {
    let { postId, statusName } = req.allParams();
    let post;

    // Find an exist post
    try {
      post = await Post.findOne(postId);
    } catch (e) {
      return res.serverError(e);
    }

    // If not find this post
    if(_.isEmpty(post)) {
      return res.badRequest(ErrorService.responseError('this post does not exist'));
    }

    // Check status is valid or not
    const status = ['publish', 'draft', 'trash', 'pending'];
    if(!_.includes(status, statusName)) {
      return res.badRequest(ErrorService.responseError('status is not valid'));
    }

    // Update status for category post
    const postCategories = await PostCategory.find({ post: post.id });
    for (const postCategory of postCategories) {
      postCategory.status = statusName;
      await PostCategory.update({ id: postCategory.id }, postCategory);
    }

    // Set status to trash
    post.status = statusName;

    try {
      let result = await Post.update({ id: post.id }, post).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   *`PostController.deleteEach()`
   */
  async deleteEach(req, res) {
    let params = req.allParams();

    // Validate field
    let schema = Joi.object().keys({
      postsId: Joi.array().required(),
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
      postsId
    } = validation;

    let param = {
      id: {
        in: postsId
      }
    };

    try {
      let result = await Post.destroy(param);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `PostController.delete()`
   */
  delete: async function (req, res) {
    let id = req.params.id;
    try {
      let result = await Post.destroyOne(id);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  }

};

