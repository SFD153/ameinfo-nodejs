/**
 * ReportController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const math = require('mathjs');
const moment = require('moment');
module.exports = {


  /**
   * `ReportController.editor()`
   */
  editor: async function (req, res) {
    let { startDate, endDate } = req.query;
    let filter = FilterService.dateRange(startDate, endDate);

    try {
      let post = Post.getDatastore().manager.collection(Post.tableName);
      let numberOfArticlesForEachAuthor = await post.aggregate([
        {
          $match: {
            scheduleDate: 0,
            status: 'publish',
          }
        },
        {
          $project: {
            'userId': '$userId',
            'date': { '$add': [ new Date(0), '$createdAt' ] },
          }
        },
        {
          $project: {
            'userId': '$userId',
            'year': { $year: '$date' },
            'month': { $month: '$date' },
            'day': { $dayOfMonth: '$date'},
          },
        },
        {
          $match: filter,
        },
        {
          $group : {
            '_id' : {
              year: '$year',
              month: '$month',
              day: '$day',
              user: '$userId',
            },
            posts: { $push: '$$ROOT' },
            count: { $sum: 1 },
          }
        },
        {
          $unwind: '$posts',
        },
        {
          $lookup: {
            'from': 'post',
            'localField': 'posts._id',
            'foreignField': '_id',
            'as': 'posts',
          },
        },
        {
          $project: {
            _id: 1,
            posts: { '$arrayElemAt': [ '$posts', 0] },
            count: 1,
          }
        },
        {
          $group : {
            '_id' : {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day',
              user: '$_id.user',
            },
            posts: { $push: '$posts' },
            count: { $sum: 1 },
          }
        },
        {
          $lookup: {
            'from': 'user',
            'localField': '_id.user',
            'foreignField': '_id',
            'as': 'user',
          },
        },
        {
          $project: {
            _id: 1,
            user: { '$arrayElemAt': [ '$user', 0] },
            posts: 1,
            count: 1,
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, }
        }
      ]).toArray();
      let totalNumberOfArticle = 0;
      let totalWordCount = 0;
      let dates = [];

      for(const item of numberOfArticlesForEachAuthor) {
        totalNumberOfArticle += item.count;
        for(const post of item.posts) {
          totalWordCount += post.content.split(' ').length;
        }

        const date = _.omit(item._id, ['user']);
        dates.push(`${date.day}${date.month}${date.year}`);
      }

      dates = _.uniq(dates);

      let averageNumberOfArticlePerDay = parseFloat((totalNumberOfArticle / dates.length).toFixed(1));
      let averageWordCount = parseFloat((totalWordCount / totalNumberOfArticle).toFixed(1));

      let result = {
        averageWordCount,
        averageNumberOfArticlePerDay,
        totalNumberOfArticle,
        numberOfArticlesForEachAuthor,
      };

      return res.ok(result);
    } catch(e) {
      return res.serverError(e);
    }
  },

  /**
   * `ReportController.csv()`
   */
  csv: async function (req, res) {
    let { startDate, endDate } = req.query;
    let filter = FilterService.dateRange(startDate, endDate);

    try {
      let post = Post.getDatastore().manager.collection(Post.tableName);
      let numberOfArticlesForEachAuthor = await post.aggregate([
        {
          $match: {
            scheduleDate: 0,
            status: 'publish',
          }
        },
        {
          $project: {
            'userId': '$userId',
            'date': { '$add': [ new Date(0), '$createdAt' ] },
          }
        },
        {
          $project: {
            'userId': '$userId',
            'year': { $year: '$date' },
            'month': { $month: '$date' },
            'day': { $dayOfMonth: '$date'},
          },
        },
        {
          $match: filter,
        },
        {
          $group : {
            '_id' : {
              year: '$year',
              month: '$month',
              day: '$day',
              user: '$userId',
            },
            posts: { $push: '$$ROOT' },
            count: { $sum: 1 },
          }
        },
        {
          $lookup: {
            'from': 'user',
            'localField': '_id.user',
            'foreignField': '_id',
            'as': 'user',
          },
        },
        {
          $project: {
            _id: 1,
            user: { '$arrayElemAt': [ '$user', 0] },
            posts: 1,
            count: 1,
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, }
        }
      ]).toArray();

      const data = [];
      for( const editor of numberOfArticlesForEachAuthor ) {
        const posts = [];
        for ( const post of editor.posts ) {
          const result = await Post.findOne(post._id.toString()).populate('categories');
          const permalink = RewriteService.permalink(result);
          posts.push(permalink);
        }
        editor.posts = posts;
        data.push(editor);
      }

      let result = { data };

      return res.ok(result);
    } catch(e) {
      return res.serverError(e);
    }
  },

  /**
   * `ReportController.tag()`
   */
  tag: async function (req, res) {
    let params = req.allParams();
    let query = QueryLanguageService.buildQueryCollection(params);
    let isOmitPosts =  _.get(params, 'omitPosts', false);

    try {
      let tag = await Tag.pagify(query);
      let result = EntityService.addCount(tag, 'posts', isOmitPosts);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `ReportController.contentType()`
   */
  contentType: async function (req, res) {
    try {
      let post = Post.getDatastore().manager.collection(Post.tableName);
      let result = await post.aggregate([
        {
          $group : {
            '_id' : '$formatId',
            'count': { '$sum': 1 },
          }
        },
        {
          $lookup: {
            'from': 'format',
            'localField': '_id',
            'foreignField': '_id',
            'as': 'format',
          },
        },
        {
          $project: {
            'count': 1,
            'format': { '$arrayElemAt': [ '$format', 0] }
          }
        }
      ]).toArray();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  }

};

