/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // 'GET /migrate/post': 'MigrateController.post',
  // 'GET /migrate/relink': 'MigrateController.relink',
  // 'GET /migrate/add-status': 'MigrateController.addStatus',
  // 'GET /migrate/rewrite-slug': 'MigrateController.rewriteSlug',

  /**
   * Home endpoints
   */
  'GET /home/featured-post': 'HomeController.featuredPost',
  'GET /home/featured-text': 'HomeController.featuredText',
  'GET /home/featured-media': 'HomeController.featuredMedia',
  'GET /home/today': 'HomeController.today',
  'GET /home/editors-picks': 'HomeController.editorsPicks',
  'GET /home/industries': 'HomeController.industries',
  'GET /home/contributors': 'HomeController.contributors',
  'GET /home/tips': 'HomeController.tips',

  /**
   * Videos endpoint
   */
  'GET /video_events': 'VideoEventController.find',
  'GET /video_event_details/:slug': 'VideoEventDetailController.find',
  'GET /video_series/:slug': 'VideoSeriesController.find',
  'GET /video_lists/:slug': 'VideoListController.find',
  'GET /video_detail/:slug': 'VideoDetailController.findOne',
  'GET /video_detail/:slug/related_videos': 'VideoDetailController.relatedVideos',

  /**
   * Articles endpoints
   */
  'GET /articles/:slug': 'ArticleController.findOne',
  'GET /articles/:slug/related_articles': 'ArticleController.relatedArticles',
  'GET /articles/:slug/users': 'ArticleController.users',
  'GET /articles/:slug/links': 'ArticleController.links',

  /**
   * Video endpoints
   */
  'GET /videos': 'VideoController.find',
  'GET /videos/count': 'VideoController.count',
  'GET /videos/:id': 'VideoController.findOne',
  'GET /videos/:id/permalink': 'VideoController.permalink',
  'POST /videos/lock/:id': 'VideoController.lock',
  'POST /videos': 'VideoController.create',
  'PUT /videos/:id': 'VideoController.update',
  'PUT /videos/:videoId/slug/:slugName': 'VideoController.updateSlug',
  'PUT /videos/:videoId/status/:statusName': 'VideoController.updateStatus',
  'DELETE /videos': 'VideoController.deleteEach',
  'DELETE /videos/:id': 'VideoController.delete',

  /**
   * VideoCategory endpoints
   */
  'GET /video_categories': 'VideoCategoryController.find',
  'GET /video_categories/slug/:slug': 'VideoCategoryController.uniqueSlug',
  'GET /video_categories/:id': 'VideoCategoryController.findOne',
  'POST /video_categories': 'VideoCategoryController.create',
  'PUT /video_categories/:id': 'VideoCategoryController.update',
  'DELETE /video_categories': 'VideoCategoryController.deleteEach',
  'DELETE /video_categories/:id': 'VideoCategoryController.delete',

  /**
   * VideoTag endpoints
   */
  'GET /video_tags': 'VideoTagController.find',
  'GET /video_tags/:id': 'VideoTagController.findOne',
  'POST /video_tags': 'VideoTagController.create',
  'POST /video_tags/findOrCreate': 'VideoTagController.findOrCreate',
  'PUT /video_tags/:id': 'VideoTagController.update',
  'DELETE /video_tags': 'VideoTagController.deleteEach',
  'DELETE /video_tags/:id': 'VideoTagController.delete',

  /**
   * Search endpoints
   */
  'GET /search/posts': 'SearchController.post',
  'GET /search/videos': 'SearchController.video',

  /**
   * Mail endpoints
   */
  'POST /mail/subscribe': 'MailController.subscribe',

  /**
   * Site endpoints
   */
  'GET /site/feed': 'SiteController.feed',
  'GET /site/generate-sitemap': 'SiteController.generateSitemap',

  /**
   * Authentication endpoints
   */
  'POST /login': 'AuthenticationController.login',
  'POST /register': 'AuthenticationController.register',
  'POST /forgot': 'AuthenticationController.forgot',
  'POST /verify/:code': 'AuthenticationController.verify',
  'POST /reset/:code': 'AuthenticationController.reset',

  /**
   * User endpoints
   */
  'GET /users': 'UserController.find',
  'GET /users/:id': 'UserController.findOne',
  'GET /users/count': 'UserController.count',
  'GET /users/group': 'UserController.group',
  'POST /users': 'UserController.create',
  'PUT /users/:id': 'UserController.update',
  'DELETE /users': 'UserController.deleteEach',
  'DELETE /users/:id': 'UserController.delete',

  /**
   * Post endpoints
   */
  'GET /posts': 'PostController.find',
  'GET /posts/:id': 'PostController.findOne',
  'GET /posts/count': 'PostController.count',
  'GET /posts/filter/category/:categoryId': 'PostController.findPostByCategoryId',
  'GET /posts/:id/permalink': 'PostController.permalink',
  'POST /posts/lock/:id': 'PostController.lock',
  'POST /posts': 'PostController.create',
  'PUT /posts/:id': 'PostController.update',
  'PUT /posts/:postId/slug/:slugName': 'PostController.updateSlug',
  'PUT /posts/:postId/status/:statusName': 'PostController.updateStatus',
  'DELETE /posts': 'PostController.deleteEach',
  'DELETE /posts/:id': 'PostController.delete',

  /**
   * Format endpoints
   */
  'GET /formats': 'FormatController.find',
  'GET /formats/:id': 'FormatController.findOne',
  'GET /formats/count': 'FormatController.count',
  'POST /formats': 'FormatController.create',
  'PUT /formats/:id': 'FormatController.update',
  'DELETE /formats/:id': 'FormatController.delete',

  /**
   * Page endpoints
   */
  'GET /pages': 'PageController.find',
  'GET /pages/:id': 'PageController.findOne',
  'GET /pages/count': 'PageController.count',
  'POST /pages': 'PageController.create',
  'PUT /pages/:id': 'PageController.update',
  'PUT /pages/:pageId/status/:statusName': 'PageController.updateStatus',
  'DELETE /pages': 'PageController.deleteEach',
  'DELETE /pages/:id': 'PageController.delete',

  /**
   * Setting endpoints
   */
  'GET /settings': 'SettingController.find',
  'GET /settings/:id': 'SettingController.findOne',
  'GET /settings/count': 'SettingController.count',
  'POST /settings': 'SettingController.create',
  'PUT /settings/featured-general/refresh': 'SettingController.featuredGeneralRefresh',
  'PUT /settings': 'SettingController.updateEach',
  'PUT /settings/:id': 'SettingController.update',
  'DELETE /settings/:id': 'SettingController.delete',

  /**
   * Role endpoints
   */
  'GET /roles': 'RoleController.find',
  'GET /roles/:id': 'RoleController.findOne',
  'GET /roles/count': 'RoleController.count',
  'POST /roles': 'RoleController.create',
  'PUT /roles/:id': 'RoleController.update',
  'DELETE /roles/:id': 'RoleController.delete',

  /**
   * Media endpoints
   */
  'GET /medias': 'MediaController.find',
  'GET /medias/:id': 'MediaController.findOne',
  'GET /medias/count': 'MediaController.count',
  'GET /medias/froala': 'MediaController.froala',
  'POST /medias': 'MediaController.create',
  'DELETE /medias/:id': 'MediaController.delete',

  /**
   * Category endpoints
   */
  'GET /categories': 'CategoryController.find',
  'GET /categories/optimization': 'CategoryController.findOptimization',
  'GET /categories/:id': 'CategoryController.findOne',
  'GET /categories/parent': 'CategoryController.parent',
  'GET /categories/count': 'CategoryController.count',
  'POST /categories': 'CategoryController.create',
  'PUT /categories/:id': 'CategoryController.update',
  'DELETE /categories': 'CategoryController.deleteEach',
  'DELETE /categories/:id': 'CategoryController.delete',

  /**
   * Tag endpoints
   */
  'GET /tags': 'TagController.find',
  'GET /tags/:id': 'TagController.findOne',
  'GET /tags/count': 'TagController.count',
  'POST /tags': 'TagController.create',
  'POST /tags/findOrCreate': 'TagController.findOrCreate',
  'PUT /tags/:id': 'TagController.update',
  'DELETE /tags': 'TagController.deleteEach',
  'DELETE /tags/:id': 'TagController.delete',

  /**
   * Post tag endpoints
   */
  'GET /posts/:postId/tags': 'PostTagController.find',
  'GET /posts/:postId/tags/:tagId': 'PostTagController.findOne',
  'POST /posts/:postId/tags': 'PostTagController.create',
  'DELETE /posts/:postId/tags/:tagId': 'PostTagController.delete',
  'DELETE /posts/:postId/tags': 'PostTagController.deleteAll',

  /**
   * Post category endpoints
   */
  'GET /posts/:postId/categories': 'PostCategoryController.find',
  'GET /posts/:postId/categories/:categoryId': 'PostCategoryController.findOne',
  'POST /posts/:postId/categories': 'PostCategoryController.create',
  'DELETE /posts/:postId/categories/:categoryId': 'PostCategoryController.delete',
  'DELETE /posts/:postId/categories': 'PostCategoryController.deleteAll',

  /**
   * Category post endpoints
   */
  'GET /categories/:categoryId/posts': 'CategoryPostController.find',
  'GET /categories/:categoryId/posts/:postId': 'CategoryPostController.findOne',

  /**
   * Tag post endpoints
   */
  'GET /tags/:tagId/posts': 'TagPostController.find',
  'GET /tags/:tagId/posts/:postId': 'TagPostController.findOne',

  /**
   * User post endpoints
   */
  'GET /users/:username/posts': 'UserPostController.find',

  /**
   * Report endpoints
   */
  'GET /reports/content-type': 'ReportController.contentType',
  'GET /reports/tag': 'ReportController.tag',
  'GET /reports/editor': 'ReportController.editor',
  'GET /reports/editor/csv': 'ReportController.csv',

  /**
   * Ad meta endpoints
   */
  'GET /ads': 'AdController.find',
  'GET /ads/:id': 'AdController.findOne',
  'GET /ads/count': 'AdController.count',
  'GET /ads/placement': 'AdController.placement',
  'POST /ads': 'AdController.create',
  'PUT /ads/:id': 'AdController.update',
  'DELETE /ads': 'AdController.deleteEach',
  'DELETE /ads/:id': 'AdController.delete',

  /**
   * Ad endpoints
   */
  'GET /ad-metas': 'AdMetaController.find',
  'GET /ad-metas/:id': 'AdMetaController.findOne',
  'POST /ad-metas': 'AdMetaController.create',
  'PUT /ad-metas/:id': 'AdMetaController.update',
  'DELETE /ad-metas': 'AdMetaController.deleteEach',
  'DELETE /ad-metas/:id': 'AdMetaController.delete',

  /**
   * Skin ad endpoints
   */
  'GET /skin-ads': 'SkinAdController.find',
  'GET /skin-ads/:id': 'SkinAdController.findOne',
  'GET /skin-ads/count': 'SkinAdController.count',
  'POST /skin-ads': 'SkinAdController.create',
  'PUT /skin-ads/:id': 'SkinAdController.update',
  'DELETE /skin-ads': 'SkinAdController.deleteEach',
  'DELETE /skin-ads/:id': 'SkinAdController.delete',

  /**
   * Weather endpoints
   */
  'GET /weather': 'WeatherController.find',

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};
