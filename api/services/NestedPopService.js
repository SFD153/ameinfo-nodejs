const nestedPop = require('nested-pop');
module.exports = {
  pagify: async function(collection, options) {
    collection.results = await nestedPop(collection.results, options);
    return collection;
  }
}
