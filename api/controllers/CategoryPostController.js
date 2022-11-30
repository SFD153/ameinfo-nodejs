/**
 * CategoryPostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const objectId = require('valid-objectid');
module.exports = {
  /**
   * `CategoryPostController.find()`
   */
  find: async function (req, res) {
    let params = req.allParams();
    let categoryId = params.categoryId;
    let queryable = {};

    if(objectId.isValid(categoryId)) {
      queryable.id = categoryId;
    } else {
      queryable.slug = categoryId;
    }

    // Get information of category
    let category = await Category.findOne(queryable).populate('parent');
    let id = _.get(category, 'id');

    if(!category) {
      return res.badRequest('Can not find category');
    }

    // Get default where and
    let query = QueryLanguageService.buildQueryCollection(params);

    let postIds = [];
    let postMeta = null;
    try {
      let status = _.get(query, 'where.status');
      status = _.isEmpty(status) ? 'publish' : status;
      let categoryQuery = { ...query, where: { category: id, status } };
      categoryQuery = _.omit(categoryQuery, ['select', 'populate']);
      const categories = await PostCategory.pagify(categoryQuery);
      postIds = _.map(categories.results, 'post');
      postMeta = categories.meta;
    } catch (e) {
      return res.serverError(e);
    }

    try {
      let postQuery = { ...query, page: 1, where: { ...query.where, id: postIds} };
      let result = await Post.pagify(postQuery);
      result.category = category;
      result.meta = postMeta;
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `CategoryPostController.findOne()`
   */
  findOne: async function (req, res) {
    let { categoryId, postId } = req.allParams();
    try {
      let result = await PostCategory.findOne({
        where: {
          post: postId,
          category: categoryId
        }
      });
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

};

