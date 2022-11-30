/**
 * SearchController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  /**
   * `SearchController.post()`
   */
  post: async function (req, res) {
    let { keywords, page, isAdmin, perPage, title, createdAt } = req.allParams();

    if(_.isEmpty(keywords)) {
      return res.ok({ results: [], meta: {} });
    }

    if(!_.isUndefined(page)) {
      page = parseInt(page);
    }

    if(!_.isUndefined(perPage)) {
      perPage = parseInt(perPage);
    }

    if(page < 0 || perPage < 0) {
      return res.badRequest({ message: 'params is invalid' });
    }

    const defaultPage = page || 1;
    const limit = perPage || 10;
    const skip = limit > 0 ? limit * ( defaultPage - 1 ) : limit * defaultPage;
    let sort = {};

    if(!_.isUndefined(title)) {
      sort.title = title;
    } else {
      sort.createdAt = createdAt || 'DESC';
    }

    const texts = keywords
      .split(' ')
      .map(word => `"${word}"`)
      .join(' ');

    let query = {
      $text: { $search: texts },
      scheduleDate: 0,
    };

    if(isAdmin) {
      query.$or = [
        { status: 'publish' },
        { status: 'draft' },
        { status: 'pending' }
      ];
    } else {
      query.status = 'publish';
    }

    const sorts = Object.entries(sort);
    for(const [key, value] of sorts) {
      sort[key] = value === 'ASC' ? 1 : -1;
    }

    const db = Post.getDatastore().manager;
    const post = db.collection(Post.tableName);
    const collection = post
      .find(query)
      .sort(sort);
    const count = collection.count();
    const data = collection.limit(limit).skip(skip).toArray();

    try {
      let [ items, total ] = await Promise.all([ data, count ]);
      let posts = items.map(record => record._id.toString());
      let results = await Post
        .find({ select: [ 'title', 'slug', 'status', 'scheduleDate', 'createdAt', 'updatedAt' ]})
        .where({ id: posts })
        .sort('createdAt DESC')
        .populate('thumbnail')
        .populate('categories')
        .populate('tags')
        .populate('user');

      let totalPage = Math.ceil(total / limit) || 1;
      let meta = {
        currentPage: defaultPage,
        nextPage: defaultPage < totalPage ? defaultPage + 1 : null,
        prevPage: defaultPage > 1 ? defaultPage - 1 : null,
        totalPage: totalPage,
        totalCount: total,
        perPage: limit,
      };

      return res.ok({ results, meta });
    } catch (e) {
      return res.serverError(e);
    }

  },

  /**
   * `SearchController.video()`
   */
  video: async function (req, res) {
    let { page, isAdmin, perPage, keywords } = req.query;

    if(_.isEmpty(keywords)) {
      return res.ok({ results: [], meta: {} });
    }

    if(!_.isUndefined(page)) {
      page = parseInt(page);
    }

    if(!_.isUndefined(perPage)) {
      perPage = parseInt(perPage);
    }

    if(page < 0 || perPage < 0) {
      return res.badRequest({ message: 'params is invalid' });
    }

    const defaultPage = page || 1;
    const limit = perPage || 10;
    const skip = limit > 0 ? limit * ( defaultPage - 1 ) : limit * defaultPage;

    const texts = keywords
      .split(' ')
      .map(word => `"${word}"`)
      .join(' ');

    let query = {
      $text: { $search: texts },
      scheduleDate: 0,
    };

    if(isAdmin) {
      query.$or = [
        { status: 'publish' },
        { status: 'draft' }
      ];
    } else {
      query.status = 'publish';
    }

    const db = Post.getDatastore().manager;
    const video = db.collection(Video.tableName);
    const collection = video
      .find(query)
      .sort({ createdAt: -1 });
    const count = collection.count();
    const data = collection.limit(limit).skip(skip).toArray();

    try {
      let [ items, total ] = await Promise.all([ data, count ]);
      let videos = items.map(record => record._id.toString());
      let results = await Video
        .find({ select: ['title', 'slug', 'status', 'scheduleDate', 'createdAt', 'updatedAt' ]})
        .where({ id: videos })
        .sort('createdAt DESC')
        .populate('categories')
        .populate('tags')
        .populate('user');

      let totalPage = Math.ceil(total / limit) || 1;
      let meta = {
        currentPage: defaultPage,
        nextPage: defaultPage < totalPage ? defaultPage + 1 : null,
        prevPage: defaultPage > 1 ? defaultPage - 1 : null,
        totalPage: totalPage,
        totalCount: total,
        perPage: limit,
      };

      return res.ok({ results, meta });
    } catch (e) {
      return res.serverError(e);
    }

  }

};

