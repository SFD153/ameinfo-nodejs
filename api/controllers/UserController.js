/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Joi = require('joi');

module.exports = {


  /**
   *`UserController.find()`
   */
  async find(req, res) {
    let query = QueryLanguageService.buildQueryCollection(req.allParams());
    try {
      let result = await User.pagify(query);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   *`UserController.findOne()`
   */
  async findOne(req, res) {
    let query = QueryLanguageService.buildQueryModel(req.allParams());
    try {
      let result = await User.findOne(query.criteria, query.populates);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `UserController.group()`
   */
  async group(req, res) {
    try {
      let user = User.getDatastore().manager.collection(User.tableName);
      let total = await User.count();

      let all = {
        count: total,
        role: {
          display: 'All'
        }
      };

      let result = await user.aggregate([
        {
          $group : {
            '_id' : '$roleId',
            'count': { '$sum': 1 },
          }
        },
        {
          $lookup: {
            'from': 'role',
            'localField': '_id',
            'foreignField': '_id',
            'as': 'role',
          },
        },
        {
          $project: {
            'count': 1,
            'role': { '$arrayElemAt': [ '$role', 0] }
          }
        }
      ]).toArray();

      // Sort ASC for role display
      result = _.sortBy(result, item => item.role.display);

      // Add total user in the first array of results
      result.unshift(all);

      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   * `UserController.count()`
   */
  count: async function (req, res) {
    let query = QueryLanguageService.buildCountQuery(req.allParams());
    try {
      let result = await User.count(query.criteria);
      return res.ok({ total: result });
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   *`UserController.create()`
   */
  async create(req, res) {
    let params = req.allParams();
    let schema = Joi.object().keys({
      username: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      firstName: Joi.string().optional().allow('').default(''),
      lastName: Joi.string().optional().allow('').default(''),
      activationKey: Joi.string().optional().allow('').default(''),
      biographicalInfo: Joi.string().optional().allow('').default(''),
      status: Joi.number().optional().default(0),
      roleId: Joi.string().required(),
      avatarId: Joi.string().optional().default(null)
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
      firstName,
      lastName,
      activationKey,
      biographicalInfo,
      status,
      roleId,
      avatarId
    } = validation;

    // Check username is exist or not
    const isExistUsername = await User.findOne({ username });
    if(isExistUsername) {
      return res.itemExist('username is already exist');
    }

    // Check email is exist or not
    const isExistEmail = await User.findOne({ email });
    if(isExistEmail) {
      return res.itemExist('email is already exist');
    }

    // Encrypted password
    let encryptedPassword = await PasswordService.hashPassword(password);

    let data = {
      username: username,
      email: email,
      password: encryptedPassword,
      firstName: firstName,
      lastName: lastName,
      activationKey: activationKey,
      biographicalInfo: biographicalInfo,
      status: status,
      role: roleId,
      avatar: avatarId
    };

    try {
      let result = await User.create(data).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   *`UserController.update()`
   */
  async update(req, res) {
    let params = req.allParams();

    // Validate username, email and password field
    let schema = Joi.object().keys({
      id: Joi.string().required(),
      username: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().optional().allow('').default(''),
      firstName: Joi.string().optional().allow('').default(''),
      lastName: Joi.string().optional().allow('').default(''),
      biographicalInfo: Joi.string().optional().allow('').default(''),
      activationKey: Joi.string().optional().allow('').default(''),
      status: Joi.number().optional().default(0),
      roleId: Joi.string().required(),
      avatarId: Joi.string().optional().default(null)
    });

    // Validate username, email and password field
    let validation;
    try {
      validation = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    // Save user to database
    let {
      id,
      username,
      email,
      password,
      firstName,
      lastName,
      biographicalInfo,
      activationKey,
      status,
      roleId,
      avatarId
    } = validation;

    // Find this user
    let user;
    try {
      user = await User.findOne(id);
    } catch (e) {
      return res.serverError(e);
    }

    // Validate email if user change email
    if(user.email !== email) {
      const isExistEmail = await User.findOne({ email });
      if(isExistEmail) {
        return res.itemExist('email is already exist');
      }
    }

    // Validate username if user change username
    if(user.username !== username) {
      const isExistUsername = await User.findOne({ username });
      if(isExistUsername) {
        return res.itemExist('username is already exist');
      }
    }

    // Encrypted password
    let encryptedPassword = user.password;
    if(!_.isEmpty(password)) {
      encryptedPassword = await PasswordService.hashPassword(password);
    }

    let data = {
      username: username,
      email: email,
      password: encryptedPassword,
      firstName: firstName,
      lastName: lastName,
      biographicalInfo: biographicalInfo,
      activationKey: activationKey,
      status: status,
      role: roleId,
      avatar: avatarId
    };

    try {
      let result = await User.update({id: id}, data).fetch();
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   *`UserController.deleteEach()`
   */
  async deleteEach(req, res) {
    let params = req.allParams();

    // Validate field
    let schema = Joi.object().keys({
      usersId: Joi.array().required(),
    });

    // Validate username, email and password field
    let validation;
    try {
      validation = await Joi.validate(params, schema);
    } catch (e) {
      return res.badValidation(e);
    }

    // Save user to database
    let {
      usersId
    } = validation;

    let param = {
      id: {
        in: usersId
      }
    };

    try {
      let result = await User.destroy(param);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  },

  /**
   *`UserController.delete()`
   */
  async delete(req, res) {
    let id = req.params.id;
    try {
      let result = await User.destroyOne(id);
      return res.ok(result);
    } catch (e) {
      return res.serverError(e);
    }
  }
};

