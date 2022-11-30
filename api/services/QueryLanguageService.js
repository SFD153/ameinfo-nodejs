const flaverr = require('flaverr');
const objectId = require('valid-objectid');

module.exports = {
  buildQueryCollection(params) {
    let query = {};

    if(!_.isEmpty(params.select)) {
      query.select = params.select.split(',').map((attribute) => attribute.trim());
    }

    if(!_.isEmpty(params.omit)) {
      query.omit = params.omit.split(',').map((attribute) => attribute.trim());
    }

    if(!_.isEmpty(params.where)) {
      let where = _.get(params, 'where');

      if (_.isString(where)) {
        try {
          where = JSON.parse(where);
        } catch (e) {
          throw flaverr({ name: 'UsageError' }, new Error('Could not JSON.parse() the provided `where` clause. Here is the raw error: '+e.stack));
        }
      }

      query.where = where;
    }

    if(!_.isEmpty(params.sort)) {
      query.sort = params.sort;
    }

    if(!_.isEmpty(params.page)) {
      query.page = parseInt(params.page);
    }

    if(!_.isEmpty(params.perPage)) {
      query.perPage = parseInt(params.perPage);
    }

    if(!_.isEmpty(params.populate)) {
      let attributes = params.populate.split(',');
      let populate = {};
      attributes.forEach((attribute) => {
        populate[attribute.trim()] = {};
      });
      query.populate = populate;
    }

    if(!_.isEmpty(params.nestedPop)) {
      query.nestedPop = params.nestedPop.split(',').map((attribute) => attribute.trim());
    }

    return query;
  },

  buildSubQueryCollection(params) {
    let query = {};

    if(!_.isEmpty(params.select)) {
      query.select = params.select.split(',').map((attribute) => attribute.trim());
    }

    if(!_.isEmpty(params.omit)) {
      query.omit = params.omit.split(',').map((attribute) => attribute.trim());
    }

    if(!_.isEmpty(params.where)) {
      let where = _.get(params, 'where');

      if (_.isString(where)) {
        try {
          where = JSON.parse(where);
        } catch (e) {
          throw flaverr({ name: 'UsageError' }, new Error('Could not JSON.parse() the provided `where` clause. Here is the raw error: '+e.stack));
        }
      }

      query.where = where;
    }

    if(!_.isEmpty(params.sort)) {
      query.sort = params.sort;
    }

    if(!_.isEmpty(params.skip)) {
      query.skip = parseInt(params.skip);
    }

    if(!_.isEmpty(params.limit)) {
      query.limit = parseInt(params.limit);
    }

    return query;
  },

  buildQueryModel(params) {
    let query = {
      criteria: {},
      populates: {}
    };

    if(!_.isEmpty(params.id)) {
      let id = params.id;
      let where = { id: id };

      // If id is a slug
      if(!objectId.isValid(id)) {
        where = { slug: id };
      }

      query.criteria.where = where;
    }

    if(!_.isEmpty(params.select)) {
      query.criteria.select = params.select.split(',').map((attribute) => attribute.trim());
    }

    if(!_.isEmpty(params.omit)) {
      query.criteria.omit = params.omit.split(',').map((attribute) => attribute.trim());
    }

    if(!_.isEmpty(params.populate)) {
      let attributes = params.populate.split(',');
      let populates = {};
      attributes.forEach((attribute) => {
        populates[attribute.trim()] = {};
      });
      query.populates = populates;
    }

    return query;
  },

  buildCountQuery(params) {
    let query = {
      criteria: {}
    };

    if(!_.isEmpty(params.where)) {
      let where = params.where;

      if (_.isString(where)) {
        try {
          where = JSON.parse(where);
        } catch (e) {
          throw flaverr({ name: 'UsageError' }, new Error('Could not JSON.parse() the provided `where` clause. Here is the raw error: '+e.stack));
        }
      }

      query.criteria.where = where;
    }

    return query;
  }
}
