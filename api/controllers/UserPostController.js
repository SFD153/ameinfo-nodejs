/**
 * UserPostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  /**
   * `UserPostController.find()`
   */
  find: async function (req, res) {
    const params = req.allParams();
    const { username } = params;

    let user;
    try {
      user = await User.findOne({ username });
    } catch (e) {
      return res.serverError({ e });
    }

    const query = QueryLanguageService.buildQueryCollection(params);
    query.where.user = user.id;

    try {
      let result = await Post.pagify(query);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  }

};

