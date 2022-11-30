/**
 * MediaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Joi = require('joi');
const skipperS3 = require('skipper-s3');
module.exports = {


  /**
   * `MediaController.find()`
   */
  find: async function (req, res) {
    let query = QueryLanguageService.buildQueryCollection(req.allParams());
    try {
      let result = await Media.pagify(query);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `MediaController.findOne()`
   */
  findOne: async function (req, res) {
    let query = QueryLanguageService.buildQueryModel(req.allParams());
    try {
      let result = await Media.findOne(query.criteria, query.populates);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `MediaController.count()`
   */
  count: async function (req, res) {
    let query = QueryLanguageService.buildCountQuery(req.allParams());
    try {
      let result = await Media.count(query.criteria);
      return res.ok({ total: result });
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `MediaController.froala()`
   */
  froala: async function(req, res) {
    try {
      let medias = await Media.find().limit(10);
      let results = medias.map(media => ({
        url: media.link,
        name: media.name,
        id: media.id,
      }));
      return res.ok(results);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `MediaController.create()`
   */
  create: async function (req, res) {
    req.file('media').upload({
      adapter: skipperS3,
      key: sails.config.custom.s3AccessKey,
      secret: sails.config.custom.s3SecretKey,
      bucket: sails.config.custom.s3Bucket,
      region: sails.config.custom.s3Region
    }, async (err, uploadedFiles) => {
      if(err) {
        return res.serverError(err);
      }

      let uploadedFile = uploadedFiles[0];
      let data = {
        name: uploadedFile.filename,
        hash: uploadedFile.fd.split('.')[0],
        extension: uploadedFile.fd.split('.')[1],
        mime: uploadedFile.type,
        size: uploadedFile.size,
        link: uploadedFile.extra.Location
      };

      try {
        let result = await Media.create(data).fetch();
        return res.ok(result);
      } catch (e) {
        return res.serverError(e);
      }
    });
  },

  /**
   * `MediaController.delete()`
   */
  delete: async function (req, res) {
    let id = req.params.id;
    try {
      let result = await Media.destroy(id);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  }

};

