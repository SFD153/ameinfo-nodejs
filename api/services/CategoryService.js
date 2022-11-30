module.exports = {
  findParent(item) {
    if(_.isEmpty(item)) {
      return '/';
    }

    const category = PermalinkService.find(item.id);
    return category.path;
  },
};
