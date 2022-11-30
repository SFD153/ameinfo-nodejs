/**
 * MailController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const request = require('superagent');
const Joi = require('joi');
module.exports = {


  /**
   * `MailController.subscribe()`
   */
  subscribe: async function (req, res) {
    const params = req.allParams();
    const schema = Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().required().email(),
      privacy: Joi.boolean().required()
    });

    // Validate username, email and password field
    let validation;
    try {
      validation = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    // Send data to media quest server
    try {
      let query = SubscribeService.getQuery(validation);
      let result = await request.get('https://link.mediaquestcorp.com/u/register.php').query(query);
      return res.saveSubscriber(result);
    } catch (e) {
      return res.serverError(e);
    }
  }
};

