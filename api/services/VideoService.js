const uniqid = require('uniqid');
module.exports = {
  async generateSlug(slug) {
    const videos = await Video.find({ slug: slug });

    // Check slug is exist or not
    if(!_.isEmpty(videos)) {
      slug = uniqid(`${slug}-`);
    }

    return slug;
  },
  getYoutubeId(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length === 11)? match[7] : false;
  },
  getYoutubeThumbnail(url) {
    return `https://img.youtube.com/vi/${this.getYoutubeId(url)}/0.jpg`;
  }
};
