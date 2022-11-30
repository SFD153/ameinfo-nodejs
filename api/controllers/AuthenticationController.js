/**
 * AuthenticationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Joi = require('joi');
const passport = require('passport');
const uuid = require('uuid/v4');

module.exports = {

  /**
   * `AuthenticationController.register()`
   */
  register: async function (req, res) {
    let params = req.allParams();
    const schema = Joi.object().keys({
      username: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().required()
    });

    // Validate username, email and password field
    let validation;

    try {
      validation = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    // Save one user into database
    let {
      username,
      email,
      password,
    } = validation;

    // Encrypted password
    let encryptedPassword = await PasswordService.hashPassword(password);

    let role = await Role.findOne({ name: 'subscriber' });

    if(_.isEmpty(role)) {
      return res.serverError({ error: 'server is not available, let \'s go back later' });
    }

    let data = {
      username: username,
      email: email,
      password: encryptedPassword,
      role: role.id
    };

    // Save user into database
    let user;

    try {
      user = await User.create(data).fetch();
    } catch (e) {
      return res.serverError(e);
    }

    let userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: role.name,
    };

    // Generate json web token
    let token = JWTService.issuer(userData, '1 day');
    return res.ok({ token: token, message: 'registered successfully' });
  },

  /**
   * `AuthenticationController.login()`
   */
  login: async function (req, res) {
    let params = req.allParams();
    const schema = Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required()
    });

    // Validate username, email and password field
    try {
      await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    // Authentication user
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if(err || !user) {
        return res.badRequest({
          message: info ? info.message : 'login failed'
        });
      }

      req.logIn(user, { session: false }, (err) => {
        if(err) {
          return res.send(err);
        }

        return res.send({
          message: info.message,
          token: user.token
        });
      });
    })(req, res);
  },

  /**
   *`AuthenticationController.forget()`
   */
  forgot: async function (req, res) {
    let params = req.allParams();

    const schema = Joi.object().keys({
      email: Joi.string().required().email(),
    });

    // Validate username, email and password field
    let validate;
    try {
      validate = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    const { email } = validate;
    const activationKey = uuid();

    // Find this user is exist or not
    let user;
    try {
      user = await User.findOne({ email });
    } catch (e) {
      return res.serverError(e);
    }

    if(_.isEmpty(user)) {
      return res.badRequest({ message: 'This e-mail is not in our database.'});
    }

    // Save hash key for user to reset password
    try {
      await User.update({ email }, { activationKey });
    } catch (e) {
      return res.serverError(e);
    }

    const adminUrl = sails.config.custom.adminUrl;

    const content = `
      Hi ${email}!

      We have received a request to change the password from ${email}.
      
      You can click on the link below to make a password change:
            
      ${adminUrl}/reset/${activationKey}
      
      If you are not the sender, please ignore this email.
      
      Your password will not be changed until you access the above path and make changes.
    `;

    try {
      await MailService.send({
        to: email,
        subject: 'Reset password at AMEInfo',
        text: content,
      });
      return res.ok({ message: 'successfully' });
    } catch (e) {
      LogService.error(e);
      return res.badRequest(e);
    }
  },

  /**
   * `AuthenticationController.verify()`
   */
  verify: async function (req, res) {
    const { code } = req.allParams();

    // Find user has activation key
    let user;
    try {
      user = await User.findOne({ activationKey: code });
    } catch (e) {
      return res.serverError(e);
    }

    // If not find out user then return
    if(!user) {
      return res.badRequest({ message: 'it is not valid code'});
    }

    return res.ok({ message: 'successfully' });
  },

  /**
   * `AuthenticationController.reset()`
   */
  reset: async function (req, res) {
    let params = req.allParams();

    const schema = Joi.object().keys({
      code: Joi.string().required(),
      password: Joi.string().required(),
    });

    // Validate password field
    let validate;
    try {
      validate = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    const { password, code } = validate;
    const hashPassword = await PasswordService.hashPassword(password);

    try {
      await User.update({ activationKey: code}, { activationKey: '', password: hashPassword });
      return res.ok({ message: 'successfully' });
    } catch (e) {
      return res.serverError(e);
    }
  },
};

