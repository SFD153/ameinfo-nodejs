/**
 * VideoListController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  /**
   * `VideoListController.find()`
   */
  find: async function (req, res) {
    try {
      const { page } = req.query;
      const { slug } = req.params;
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
                { 'category.slug': slug },
                { 'video.status': 'publish' },
                { 'video.scheduleDate': 0 },
                { 'video.password': '' }
              ]
            }
          },
          { $replaceRoot: { newRoot: '$video' } },
          { $sort: { 'createdAt': -1 } },
          { $limit: 10 },
          { $skip: (page - 1 || 0) * 10 },
        ])
        .toArray();
      return res.ok(data);
    } catch (e) {
      return res.serverError(e);
    }
  }

};

