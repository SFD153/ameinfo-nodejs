module.exports = {
  getFeaturePostLimit (name) {
    const data = {
      featuredPost: 1,
      featuredText: 5,
      featuredMedia: 3,
      topInterview: 5,
      topAnalysis: 5,
      topFeature: 5,
      stream: 9,
      tip: 6,
      inspire: 8,
      today: 4,
      editor: 4,
    };

    return data[name];
  },

  async featuredGeneralRefresh () {
    const setting = await Setting.findOne({ name: 'featured_general' });
    let featuredGeneral = JSON.parse(setting.value);
    let excludePostId = [];
    let emptyFields = [];
    let limit = 0;
    let keys = Object.keys(featuredGeneral).filter(key => key[0] === '_');

    // Remove previous empty keys
    featuredGeneral = _.omit(featuredGeneral, keys);

    // Loop through each item to get limit and empty fields
    Object.keys(featuredGeneral).forEach(key => {
      const value = featuredGeneral[key];

      if (!_.isEmpty(value)) {
        excludePostId.push(value.map(item => item.key));
        return false;
      }

      limit += this.getFeaturePostLimit(key);
      emptyFields.push(key);
    });

    excludePostId = _.flattenDeep(excludePostId);

    // Find post exclude these id below
    let posts = await Post
      .find({
        select: ['id']
      })
      .where({
        id: { '!=': excludePostId },
        status: 'publish',
        scheduleDate: 0,
      })
      .sort('createdAt DESC')
      .limit(limit);

    posts = posts.map(post => post.id);

    // Add default post id for these empty field
    emptyFields.forEach(field => {
      const index = this.getFeaturePostLimit(field);
      featuredGeneral[`_${field}`] = posts.splice(0, index);
    });

    // Update setting value
    setting.value = JSON.stringify(featuredGeneral);

    // Update Setting
    await Setting.update({ id: setting.id }, setting);
  }
};
