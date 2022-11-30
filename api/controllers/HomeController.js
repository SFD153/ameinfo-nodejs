/**
 * HomeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  /**
   * `HomeController.featuredPost()`
   */
  featuredPost: async function (req, res) {
    let cachedResult;
    try {
      cachedResult = await RedisService.get('featuredPost');
    } catch (e) {
      return res.serverError(e);
    }

    if(cachedResult) {
      return res.ok(cachedResult);
    }

    let setting;
    try {
      setting = await Setting.findOne({name: 'featured_general'});
    } catch (e) {
      return res.serverError(e);
    }

    let records = JSON.parse(setting.value);
    let record = records.featuredPost.map(item => item.key);

    if (_.isEmpty(record)) {
      record = records._featuredPost;
    }

    try {
      const posts = await Post
        .find({select: ['title', 'slug']})
        .where({id: record})
        .sort('createdAt DESC')
        .populate('thumbnail')
        .populate('categories');
      const result = posts.map(post => {
        post.permalink = RewriteService.permalink(post);
        return post;
      });
      await RedisService.set('featuredPost', result);
      return res.ok(result);
    } catch (e) {
      return res.badRequest(e);
    }
  },

  /**
   * `HomeController.featuredText()`
   */
  featuredText: async function (req, res) {
    let cachedResult;
    try {
      cachedResult = await RedisService.get('featuredText');
    } catch (e) {
      return res.serverError(e);
    }

    if(cachedResult) {
      return res.ok(cachedResult);
    }

    let setting;
    try {
      setting = await Setting.findOne({name: 'featured_general'});
    } catch (e) {
      return res.serverError(e);
    }

    let records = JSON.parse(setting.value);
    let record = records.featuredText.map(item => item.key);

    if (_.isEmpty(record)) {
      record = records._featuredText;
    }

    try {
      const posts = await Post
        .find({select: ['title', 'slug']})
        .where({id: record})
        .sort('createdAt DESC')
        .populate('categories');
      const result = posts.map(post => {
        post.permalink = RewriteService.permalink(post);
        return post;
      });
      await RedisService.set('featuredText', result);
      return res.ok(result);
    } catch (e) {
      return res.badRequest(e);
    }
  },

  /**
   * `HomeController.featuredMedia()`
   */
  featuredMedia: async function (req, res) {
    let cachedResult;
    try {
      cachedResult = await RedisService.get('featuredMedia');
    } catch (e) {
      return res.serverError(e);
    }

    if(cachedResult) {
      return res.ok(cachedResult);
    }

    let setting;

    try {
      setting = await Setting.findOne({name: 'featured_general'});
    } catch (e) {
      return res.serverError(e);
    }

    let records = JSON.parse(setting.value);
    let record = records.featuredMedia.map(item => item.key);

    if (_.isEmpty(record)) {
      record = records._featuredMedia;
    }

    try {
      const posts = await Post
        .find({select: ['title', 'slug']})
        .where({id: record})
        .sort('createdAt DESC')
        .populate('thumbnail')
        .populate('categories');
      const result = posts.map(post => {
        post.permalink = RewriteService.permalink(post);
        return post;
      });
      await RedisService.set('featuredMedia', result);
      return res.ok(result);
    } catch (e) {
      return res.badRequest(e);
    }
  },

  /**
   * `HomeController.today()`
   */
  today: async function (req, res) {
    let cachedResult;
    try {
      cachedResult = await RedisService.get('today');
    } catch (e) {
      return res.serverError(e);
    }

    if(cachedResult) {
      return res.ok(cachedResult);
    }

    let setting;

    try {
      setting = await Setting.findOne({name: 'featured_general'});
    } catch (e) {
      return res.serverError(e);
    }

    let records = JSON.parse(setting.value);
    let record = records.today.map(item => item.key);

    if (_.isEmpty(record)) {
      record = records._today;
    }

    try {
      const posts = await Post
        .find({select: ['title', 'slug']})
        .where({id: record})
        .sort('createdAt DESC')
        .populate('thumbnail')
        .populate('categories');
      const result = posts.map(post => {
        post.permalink = RewriteService.permalink(post);
        return post;
      });
      await RedisService.set('today', result);
      return res.ok(result);
    } catch (e) {
      return res.badRequest(e);
    }
  },

  /**
   * `HomeController.editorsPicks()`
   */
  editorsPicks: async function (req, res) {
    let cachedResult;
    try {
      cachedResult = await RedisService.get('editorsPicks');
    } catch (e) {
      return res.serverError(e);
    }

    if(cachedResult) {
      return res.ok(cachedResult);
    }

    let setting;

    try {
      setting = await Setting.findOne({name: 'featured_general'});
    } catch (e) {
      return res.serverError(e);
    }

    let records = JSON.parse(setting.value);
    let record = records.editor.map(item => item.key);

    if (_.isEmpty(record)) {
      record = records._editor;
    }

    try {
      const posts = await Post
        .find({select: ['title', 'slug']})
        .where({id: record})
        .sort('createdAt DESC')
        .populate('thumbnail')
        .populate('categories');
      const result = posts.map(post => {
        post.permalink = RewriteService.permalink(post);
        return post;
      });
      await RedisService.set('editorsPicks', result);
      return res.ok(result);
    } catch (e) {
      return res.badRequest(e);
    }
  },

  /**
   * `HomeController.industries()`
   */
  industries: async function (req, res) {
    let cachedResult;
    try {
      cachedResult = await RedisService.get('industries');
    } catch (e) {
      return res.serverError(e);
    }

    if(cachedResult) {
      return res.ok(cachedResult);
    }

    let setting;

    try {
      setting = await Setting.findOne({name: 'featured_general'});
    } catch (e) {
      return res.serverError(e);
    }

    let records = JSON.parse(setting.value);
    let record = records.industry.map(item => item.key);

    if (_.isEmpty(record)) {
      record = records._industry;
    }

    let results = [];

    for (const categoryId of record) {
      // Get category information
      let category;
      try {
        category = await Category.findOne().where({id: categoryId}).populate('parent');
      } catch (e) {
        break;
      }

      // Get list of post ids based on category Id
      let postIds;
      try {
        postIds = await PostCategory
          .find({select: ['post']})
          .sort('createdAt DESC')
          .limit(5)
          .where({
            status: 'publish',
            category: categoryId
          });
        postIds = postIds.map(record => record.post);
      } catch (e) {
        break;
      }


      // Fetch all posts based on category
      let posts;
      try {
        posts = await Post
          .find({select: ['title', 'slug']})
          .where({id: postIds})
          .sort('createdAt DESC')
          .populate('thumbnail')
          .populate('categories');
        posts = posts.map(post => {
          post.permalink = RewriteService.permalink(post);
          return post;
        });
      } catch (e) {
        break;
      }


      // Inject category name into list of posts
      let data = {
        ...category,
        posts
      };

      // Push data into results
      results.push(data);
    }

    await RedisService.set('industries', results);

    return res.ok(results);
  },

  /**
   * `HomeController.contributors()`
   */
  contributors: async function (req, res) {
    let cachedResult;
    try {
      cachedResult = await RedisService.get('contributors');
    } catch (e) {
      return res.serverError(e);
    }

    if(cachedResult) {
      return res.ok(cachedResult);
    }

    let setting;

    try {
      setting = await Setting.findOne({name: 'featured_general'});
    } catch (e) {
      return res.serverError(e);
    }

    let records = JSON.parse(setting.value);
    let record = records.author.map(item => item.key);

    if (_.isEmpty(record)) {
      record = records._author;
    }

    try {
      const result = await User
        .find({select: ['firstName', 'lastName', 'username']})
        .where({id: record})
        .sort('createdAt DESC')
        .populate('avatar');
      await RedisService.set('contributors', result);
      return res.ok(result);
    } catch (e) {
      return res.badRequest(e);
    }
  },

  /**
   * `HomeController.tips()`
   */
  tips: async function (req, res) {
    let cachedResult;
    try {
      cachedResult = await RedisService.get('tips');
    } catch (e) {
      return res.serverError(e);
    }

    if(cachedResult) {
      return res.ok(cachedResult);
    }

    let setting;

    try {
      setting = await Setting.findOne({name: 'featured_general'});
    } catch (e) {
      return res.serverError(e);
    }

    let records = JSON.parse(setting.value);
    let record = records.tip.map(item => item.key);

    if (_.isEmpty(record)) {
      record = records._tip;
    }

    try {
      const posts = await Post
        .find({select: ['title', 'slug']})
        .where({id: record})
        .sort('createdAt DESC')
        .populate('thumbnail')
        .populate('categories');
      const result = posts.map(post => {
        post.permalink = RewriteService.permalink(post);
        return post;
      });
      await RedisService.set('tips', result);
      return res.ok(result);
    } catch (e) {
      return res.badRequest(e);
    }
  }

};

