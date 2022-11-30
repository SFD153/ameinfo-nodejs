module.exports = {
  addCount(collection, target = 'posts', omit = false) {
    let data = collection.results || collection;
    let results = data.map((model) => {
      if(!model[target]) {
        return model;
      }

      model.count = model[target].length;
      return omit ? _.omit(model, target) : model;
    });

    if(collection.results) {
      collection.results = results;
    } else {
      collection = results;
    }

    return collection;
  },

  omit(params, collection, target = 'post') {
    if(_.isUndefined(params) || _.isEmpty(collection)) {
      return collection;
    }

    params = params.split(',').map(param => param.trim());
    return collection.map(model => {
      model[target] = _.omit(model[target], params);
      return model;
    });
  }
}
