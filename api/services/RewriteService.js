module.exports = {
  permalink(post) {
    if(_.isEmpty(post.slug) && _.isEmpty(post.categories)) {
      return '/uncategorized/';
    }

    const postCategory = _.first(post.categories);

    if(_.isEmpty(postCategory)) {
      return '/uncategorized/' + post.slug;
    }

    const category = PermalinkService.find(postCategory.id);

    return `${category.path}/${post.slug}`;
  },
};
