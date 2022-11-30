/**
 * MigrateController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  /**
   * `MigrateController.post()`
   */
  post: async function (req, res) {
    await DatabasePostService.migrateData();
    return res.json({ message: 'successfully' });
  },

  /**
   * `MigrateController.user()`
   */
  user: async function (req, res) {
    await DatabaseUserService.migrateData();
    return res.json({ message: 'successfully' });
  },

  /**
   * `MigrateController.relink()`
   */
  relink: async function (req, res) {
    await AuthorPostService.relink();
    return res.json({ message: 'successfully' });
  },

  /**
   * `MigrateController.addStatus()`
   */
  addStatus: async function (req, res) {
    await PostCategoryService.addStatus();
    return res.json({ message: 'successfully' });
  },

  /**
   * `MigrateController.rewriteSlug()`
   */
  rewriteSlug: async function (req, res) {
    await RewritePostService.rewriteSlug();
    return res.json({ message: 'successfully' });
  },
};

