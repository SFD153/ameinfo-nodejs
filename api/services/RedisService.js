const util = require('util');
const expiresIn = 1000*60*60*24;
const ttlInSeconds = Math.ceil(expiresIn / 1000);

module.exports = {
  async get (query) {
    let key = _.isObject(query) ? JSON.stringify(query) : query;
    return await sails.getDatastore('cache').leaseConnection(async (db)=>{
      let found = await (util.promisify(db.get).bind(db))(key);
      if (found === null) {
        return undefined;
      } else {
        return JSON.parse(found);
      }
    });
  },

  async set (key, value) {
    return await sails.getDatastore('cache').leaseConnection(async (db)=>{
      await (util.promisify(db.setex).bind(db))(key, ttlInSeconds, JSON.stringify(value));
    });
  },

  async deleteAll () {
    return await sails.getDatastore('cache').leaseConnection(async (db)=>{
      await (util.promisify(db.flushdb).bind(db))();
    });
  }
};
