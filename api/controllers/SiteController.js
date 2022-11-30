/**
 * SiteController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const RSS = require('rss');
module.exports = {
  /**
   * `SiteController.feed()`
   */
  async feed(req, res) {
    const siteUrl = sails.config.custom.siteUrl;

    let categories = await Category.find();
    categories = categories.map(category => category.name);

    const feed = new RSS({
      title: 'AMEInfo',
      description: 'The ultimate Middle East business resource',
      feed_url: `${siteUrl}/rss.xml`,
      site_url: `${siteUrl}/`,
      image_url: `${siteUrl}/favicon.ico`,
      copyright: 'All rights reserved, AMEinfo',
      generator: 'Feed for AMEinfo',
      categories: categories,
    });

    const posts = await Post.find()
      .sort('createdAt DESC')
      .populate('thumbnail')
      .populate('categories')
      .limit(20)
      .where({
        status: 'publish',
        scheduleDate: 0
      });

    posts.forEach(post => {
      const date = new Date(_.get(post, 'createdAt'));
      date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000 + 4 * 60 * 60 * 1000);
      const permalink = RewriteService.permalink(post);

      feed.item({
        title: post.title,
        description: post.summary,
        url: `${siteUrl}${permalink}`,
        guid: post.id,
        date: date,
        categories: post.categories.map(category => category.name),
        enclosure: {
          url: post.thumbnail.link,
          type: post.thumbnail.type,
        }
      });
    });

    res.setHeader('Content-type', 'text/xml');
    res.send(feed.xml());
  },

  /**
   * `SiteController.generateSitemap()`
   */
  generateSitemap: async function(req, res) {
    await SitemapService.generate();
    return res.json({ message: 'successfully' });
  }
};

