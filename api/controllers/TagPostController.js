/**
 * TagPostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const objectId = require('valid-objectid');
module.exports = {


  /**
   * `TagPostController.find()`
   */
  find: async function (req, res) {
    let params = req.allParams();
    let tagId = params.tagId;
    let queryable = {};

    if(objectId.isValid(tagId)) {
      queryable.id = tagId;
    } else {
      queryable.slug = tagId;
    }

    // Get information of tag
    let tag = await Tag.findOne(queryable);
    let id = _.get(tag, 'id');

    if(!tag) {
      return res.badRequest('Can not find tag');
    }

    // Get default where and
    let query = QueryLanguageService.buildQueryCollection(params);

    let postIds = [];
    let postMeta = null;
    try {
      let tagQuery = { ...query, where: { tag: id } };
      tagQuery = _.omit(tagQuery, ['select', 'populate']);
      const categories = await PostTag.pagify(tagQuery);
      postIds = _.map(categories.results, 'post');
      postMeta = categories.meta;
    } catch (e) {
      return res.serverError(e);
    }

    try {
      let postQuery = { ...query, page: 1, where: { ...query.where, id: postIds} };
      console.log(JSON.stringify(postQuery));
      let result = await Post.pagify(postQuery);
      result.tag = tag;
      result.meta = postMeta;
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `TagPostController.findOne()`
   */
  findOne: async function (req, res) {
    let { tagId, postId } = req.allParams();
    try {
      let result = await PostTag.findOne({
        where: {
          post: postId,
          tag: tagId
        }
      });
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

};
