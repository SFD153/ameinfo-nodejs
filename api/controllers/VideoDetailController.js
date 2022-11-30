/**
 * VideoDetailController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  /**
   * `VideoDetailController.findOne()`
   */
  findOne: async function (req, res) {
    try {
      const { slug } = req.params;
      const data = await Video
        .findOne({ slug })
        .populate('tags')
        .populate('categories');
      return res.ok(data);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `VideoDetailController.relatedVideos()`
   */
  relatedVideos: async function(req, res) {
    try {
      const { category } = req.query;
      const { slug } = req.params;

      if(!category) {
        return res.badRequest(ErrorService.responseError('category is required'));
      }

      const videoCategoryAssociation = VideoCategoryAssociation
        .getDatastore()
        .manager
        .collection(VideoCategoryAssociation.tableName);
      const data = await videoCategoryAssociation
        .aggregate([
          {
            $lookup: {
              'from': 'video',
              'localField': 'videoId',
              'foreignField': '_id',
              'as': 'video',
            }
          },
          {
            $lookup: {
              'from': 'videocategory',
              'localField': 'categoryId',
              'foreignField': '_id',
              'as': 'category',
            }
          },
          {
            $project: {
              video: { '$arrayElemAt': [ '$video', 0] },
              category: { '$arrayElemAt': [ '$category', 0] },
            }
          },
          {
            $match: {
              $and: [
                { 'category.slug': category },
                { 'video.slug': { $ne: slug }},
                { 'video.status': 'publish' },
                { 'video.scheduleDate': 0 },
                { 'video.password': '' }
              ]
            }
          },
          { $replaceRoot: { newRoot: '$video' } },
          { $sort: { 'createdAt': -1 } },
          { $limit: 3 },
        ])
        .toArray();
      return res.ok(data);
    } catch (e) {
      return res.serverError(e);
    }
  }

};

