/**
 * VideoEventController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {


  /**
   * `VideoEventController.find()`
   */
  find: async function (req, res) {
    try {
      const { page } = req.query;
      const videoCategory = VideoCategory.getDatastore().manager.collection(VideoCategory.tableName);
      const data = await videoCategory
        .aggregate([
          {
            $match: {
              parent: null
            }
          },
          {
            $lookup: {
              'from': 'media',
              'localField': 'thumbnailId',
              'foreignField': '_id',
              'as': 'thumbnail',
            }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              slug: 1,
              description: 1,
              parent: 1,
              thumbnail: { '$arrayElemAt': [ '$thumbnail', 0] },
            }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              slug: 1,
              description: 1,
              thumbnail: 1,
            }
          },
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

