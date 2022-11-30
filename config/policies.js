/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,

  /***************************************************************************
   *                                                                          *
   * Development policy for all controllers and actions.                      *
   *                                                                          *
   *                                                                          *
   ***************************************************************************/
  // '*': 'isLoggedIn',
  //
  // AuthenticationController: {
  //   login: true,
  //   register: true,
  //   forgot: true
  // },
  //
  // PostController: {
  //   find: true,
  //   findOne: true,
  //   count: true,
  //   filterCategory: true,
  // },
  //
  // PageController: {
  //   find: true,
  //   findOne: true,
  //   count: true,
  // },
  //
  // SettingController: {
  //   find: true,
  //   findOne: true,
  //   count: true,
  // },
  //
  // CategoryController: {
  //   find: true,
  //   findOne: true,
  //   count: true,
  // },
  //
  // TagController: {
  //   find: true,
  //   findOne: true,
  //   count: true,
  // },
  //
  // PostTagController: {
  //   find: true,
  //   findOne: true,
  // },
  //
  // PostCategoryController: {
  //   find: true,
  //   findOne: true,
  // },



  /***************************************************************************
   *                                                                          *
   * Production policy for all controllers and actions.                       *
   *                                                                          *
   *                                                                          *
   ***************************************************************************/
  // '*': 'isLoggedIn',
  //
  // ProfileController: {
  //   me: ['administrator', 'editor', 'author', 'contributor', 'subscriber']
  // },
  //
  // UserController: {
  //   find: 'administrator',
  //   findOne: 'administrator',
  //   count: 'administrator',
  //   create: 'administrator',
  //   update: 'administrator',
  //   delete: 'administrator',
  //   deleteEach: 'administrator'
  // },
  //
  // PostController: {
  //   find: true,
  //   findOne: true,
  //   count: true,
  //   filterCategory: true,
  //   create: ['administrator', 'editor', 'author', 'contributor'],
  //   update: ['administrator', 'editor', 'author', 'contributor'],
  //   delete: ['administrator', 'editor', 'author', 'contributor'],
  //   deleteEach: ['administrator', 'editor', 'author', 'contributor']
  // },
  //
  // FormatController: {
  //   find: ['administrator', 'editor', 'author', 'contributor'],
  //   findOne: ['administrator', 'editor', 'author', 'contributor'],
  //   count: ['administrator', 'editor', 'author', 'contributor'],
  //   create: 'administrator',
  //   update: 'administrator',
  //   delete: 'administrator',
  // },
  //
  // PageController: {
  //   find: true,
  //   findOne: true,
  //   count: true,
  //   create: ['administrator', 'editor'],
  //   update: ['administrator', 'editor'],
  //   delete: ['administrator', 'editor'],
  //   deleteEach: ['administrator', 'editor']
  // },
  //
  // SettingController: {
  //   find: true,
  //   findOne: true,
  //   count: true,
  //   create: 'administrator',
  //   update: 'administrator',
  //   updateEach: 'administrator',
  //   delete: 'administrator',
  // },
  //
  // RoleController: {
  //   find: 'administrator',
  //   findOne: 'administrator',
  //   count: 'administrator',
  //   create: 'administrator',
  //   update: 'administrator',
  //   delete: 'administrator',
  // },
  //
  // MediaController: {
  //   find: ['administrator', 'editor', 'author'],
  //   findOne: ['administrator', 'editor', 'author'],
  //   count: ['administrator', 'editor', 'author'],
  //   create: ['administrator', 'editor', 'author'],
  //   delete: ['administrator', 'editor', 'author'],
  // },
  //
  // CategoryController: {
  //   find: true,
  //   findOne: true,
  //   count: true,
  //   create: ['administrator', 'editor'],
  //   update: ['administrator', 'editor'],
  //   delete: ['administrator', 'editor'],
  //   deleteEach: ['administrator', 'editor'],
  // },
  //
  // TagController: {
  //   find: true,
  //   findOne: true,
  //   count: true,
  //   create: ['administrator', 'editor'],
  //   findOrCreate: ['administrator', 'editor', 'author', 'contributor'],
  //   update: ['administrator', 'editor'],
  //   delete: ['administrator', 'editor'],
  //   deleteEach: ['administrator', 'editor'],
  // },
  //
  // PostTagController: {
  //   find: true,
  //   findOne: true,
  //   create: 'administrator',
  //   delete: 'administrator',
  //   deleteAll: 'administrator',
  // },
  //
  // PostCategoryController: {
  //   find: true,
  //   findOne: true,
  //   create: 'administrator',
  //   delete: 'administrator',
  //   deleteAll: 'administrator',
  // },
  //
  // ReportController: {
  //   contentType: 'administrator',
  //   tag: 'administrator',
  //   editor: 'administrator',
  // },
  //
  // AdController: {
  //   find: 'administrator',
  //   findOne: 'administrator',
  //   count: 'administrator',
  //   create: 'administrator',
  //   findOrCreate: 'administrator',
  //   update: 'administrator',
  //   delete: 'administrator',
  //   deleteEach: 'administrator',
  // },
  //
  // SkinAdController: {
  //   find: 'administrator',
  //   findOne: 'administrator',
  //   count: 'administrator',
  //   create: 'administrator',
  //   findOrCreate: 'administrator',
  //   update: 'administrator',
  //   delete: 'administrator',
  //   deleteEach: 'administrator',
  // },
  //
  // AdSizeController: {
  //   find: 'administrator',
  //   findOne: 'administrator',
  //   count: 'administrator',
  //   create: 'administrator',
  //   findOrCreate: 'administrator',
  //   update: 'administrator',
  //   delete: 'administrator'
  // },
};
