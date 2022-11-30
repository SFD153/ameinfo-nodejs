/**
 * ArticleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const objectId = require('valid-objectid');
module.exports = {


  /**
   * `ArticleController.findOne()`
   */
  findOne: async function (req, res) {
    const { slug } = req.params;
    let where = { slug };
    if(objectId.isValid(slug)) {
      where = { id: slug };
    }

    try {
      const results = await Post.findOne(where).populateAll();
      return res.ok(results);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `ArticleController.relatedArticles()`
   */
  relatedArticles: async function (req, res) {
    const { slug } = req.params;

    if(!req.query.category) {
      return res.badRequest(ErrorService.responseError('category is required'));
    }

    // Get information of post
    let post = await Post
      .findOne({ select: ['id'] })
      .where({ slug });

    // Get information of category
    let category = await Category
      .findOne({ select: ['id', 'name'] })
      .where({ slug: req.query.category })
      .populate('parent');
    let id = category.id;

    if(!category) {
      return res.badRequest(ErrorService.responseError('Can not find category'));
    }

    // Get default where and
    let postIds = [];
    try {
      const categories = await PostCategory
        .find({ select: ['post'] })
        .sort('createdAt DESC')
        .where({
          post: { '!=': post.id },
          category: id,
          status: 'publish'
        })
        .limit(3);
      postIds = _.map(categories, 'post');
    } catch (e) {
      return res.serverError(e);
    }

    try {
      let posts = await Post
        .find({ select: ['title', 'slug'] })
        .sort('createdAt DESC')
        .populate('thumbnail')
        .where({
          id: postIds,
          status: 'publish'
        });
      let results = posts.map(post => {
        post.category = category.name;
        post.categories = [category];
        post.permalink = RewriteService.permalink(post);
        return post;
      });
      return res.ok(results);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `ArticleController.users()`
   */
  users: async function(req, res) {
    const { slug } = req.params;

    try {
      const post = await Post.findOne({ slug });

      if(!post.user) {
        return res.badRequest(ErrorService.responseError('user not found'));
      }

      const results = await User.findOne(post.user).populate('avatar');
      return res.ok(results);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `ArticleController.links()`
   */
  links: async function(req, res) {
    const { slug } = req.params;

    let where = { slug };
    if(objectId.isValid(slug)) {
      where = { id: slug };
    }

    try {
      const post = await Post
        .findOne({ select: ['id'] })
        .where(where)
        .populate('categories');
      const categories = post.categories.map(category => CategoryService.findParent(category));
      categories.push('/post/preview');
      return res.ok(categories);
    } catch (e) {
      return res.serverError(e);
    }
  },

};

