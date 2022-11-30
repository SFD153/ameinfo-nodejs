/**
 * ProfileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  

  /**
   * `ProfileController.me()`
   */
  me: async function (req, res) {
    let userId = req.user;

    if(!userId) {
      return res.badRequest({
        name: 'Error',
        message: 'unauthorized'
      });
    }

    try {
      let user = await User.findOne(userId);
      return res.ok(user);
    } catch (e) {
      return res.serverError(e);
    }
  }

};

