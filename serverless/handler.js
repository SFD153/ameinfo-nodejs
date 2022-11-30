'use strict';

const { MongoClient } = require('mongodb');
const moment = require('moment');
const Sitemap = require('sitemap2');
const _ = require('lodash');
const got = require('got');
const S3 = require('aws-sdk/clients/s3');

const connection = 'mongodb://ameinfo:G26VZxH66NXuDc22@18.136.211.127:27017/ameinfo-db';
const host = 'http://ameinfo.cf';
const sitemap = new Sitemap({ hostName: host });
const s3 = new S3({
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: "AKIAJ5IAPCALOLDBFHYQ",
    secretAccessKey: "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",
  }
});

const connect = async () => {
  const client = await MongoClient.connect(connection, { useNewUrlParser: true });
  return client.db('ameinfo-db');
};

module.exports.checkUnused = async () => {
  let data = {
    message: 'Trigger perform schedule post successfully'
  };

  let db;
  try {
    db = await connect();
  } catch (e) {
    data.message = 'Can not connect to database';
    return data;
  }

  // Declaire collection
  const Post = db.collection('post');

  // Get post have lock
  const posts = await Post.find({ lock: { $ne: null }}).toArray();

  for ( const post of posts ) {
    const lastUpdated = moment(post.updatedAt).add(25, 'seconds');
    if(moment().isAfter(lastUpdated)) {
      try {
        post.lock = null;
        await Post.update({ _id: post._id }, post);
        console.log('Remove lock for post: %s', post.title);
      } catch (e) {
        console.log(e);
      }
    }
  }

  process.exit(1);
};

module.exports.removeLock = async () => {
  let data = {
    message: 'Trigger perform schedule post successfully'
  };

  let db;
  try {
    db = await connect();
  } catch (e) {
    data.message = 'Can not connect to database';
    return data;
  }

  // Declaire collection
  const Video = db.collection('video');

  // Get post have lock
  const videos = await Video.find({ lock: { $ne: null }}).toArray();

  for ( const video of videos ) {
    const lastUpdated = moment(video.updatedAt).add(25, 'seconds');
    if(moment().isAfter(lastUpdated)) {
      try {
        video.lock = null;
        await Video.update({ _id: video._id }, video);
        console.log('Remove lock for video: %s', video.title);
      } catch (e) {
        console.log(e);
      }
    }
  }

  process.exit(1);
};


module.exports.generate = async () => {
  let data = {
    message: 'Trigger perform schedule post successfully'
  };

  let db;
  try {
    db = await connect();
  } catch (e) {
    data.message = 'Can not connect to database';
    return data;
  }

  // Declaire collection
  const Post = db.collection('post');
  const Page = db.collection('page');
  const Category = db.collection('category');
  const PostCategory = db.collection('postcategory');

  // Add category to sitemap
  const categories = await Category
    .aggregate([
      {
        $lookup: {
          from: 'category',
          localField: 'parent',
          foreignField: '_id',
          as: 'parent',
        },
      },
      {
        $project: {
          slug: 1,
          updatedAt: 1,
          parent: { '$arrayElemAt': [ '$parent', 0] }
        }
      }
    ])
    .toArray();

  const categorySitemap = new Sitemap({ hostName: host, fileName: 'sitemap-category.xml' });
  for ( const category of categories ) {
    let url;

    if(category.parent) {
      url = category.parent.slug + '/' + category.slug;
    } else {
      url = category.slug;
    }

    // Not correctly url then skip
    if(!url) {
      continue;
    }

    // Url contain undefined word then skip
    if(url.indexOf('undefined') > -1) {
      continue;
    }

    // Add url into sitemap
    try {
      categorySitemap.addUrl(`${host}/${url}`);
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  }

  // Add Category to sitemap
  sitemap.addSitemap(categorySitemap);

  // Create page sitemap
  const pageSitemap = new Sitemap({ hostName: host, fileName: 'sitemap-page.xml' });

  // Add page to sitemap
  const pages = await Page.find({ status: 'publish' }).toArray();

  for( const page of pages ) {
    pageSitemap.addUrl(`${host}/${page.slug}`);
  }

  sitemap.addSitemap(pageSitemap);

  const LIMIT = 1000;

  let totalOfPost = await Post.find({}).count();
  totalOfPost = parseInt(totalOfPost / LIMIT);
  let count = 1;

  for(let i=0; i<totalOfPost; i++) {
    // Create new post sitemap
    const postSitemap = new Sitemap({ hostName: host });

    // Fetch all posts
    const posts = await Post
      .find({
        status: 'publish',
        scheduleDate: 0
      })
      .skip(LIMIT * i)
      .limit(LIMIT)
      .toArray();

    // Add post to sitemap
    for(const post of posts) {
      // Track number of post has done
      console.log('Post has worked: %s', count);
      count++;

      const postCategories = await PostCategory
        .find({
          postId: post._id
        })
        .limit(1)
        .toArray();

      // Skip if not found any post category
      if(_.isEmpty(postCategories)) {
        continue;
      }

      const postCategory = _.first(postCategories);
      const foundCategory = categories.filter(category => category._id.equals(postCategory.categoryId));

      // Skip if not found category
      if(_.isEmpty(foundCategory)) {
        continue;
      }

      const category = _.first(foundCategory);

      // Skip when there is no parent category
      if(!_.get(category, 'parent')) {
        continue;
      }

      // Skip categories of country and secotrs
      if(category.parent.name === 'Country' || category.parent.name === 'Sectors') {
        continue;
      }

      const url = category.parent.slug + '/' + category.slug + '/' + post.slug;

      try {
        postSitemap.addUrl(`${host}/${url}`);
      } catch (e) {
        console.log(e);
        process.exit(1);
      }
    }

    // Add post sitemap into parent sitemap
    try {
      sitemap.addSitemap(postSitemap);
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  }

  // Save each sitemap file into s3
  const files = sitemap.toXML();

  for(const file of files) {
    try {
      await s3
        .putObject({
          Bucket: 'ameinfo-public',
          Key: file.fileName,
          Body: file.xml,
          ContentType: 'text/xml',
        })
        .promise();
    } catch (e) {
      console.log(e);
    }
  }

  // Terminate app after finish running
  process.exit(1);

};

module.exports.perform = async () => {
  let data = {
    message: 'Trigger perform schedule post successfully'
  };

  let db;
  try {
    db = await connect();
  } catch (e) {
    data.message = 'Can not connect to database';
    return data;
  }

  const Post = db.collection('post');
  const posts = await Post.find({ scheduleDate: { $gt: 0 }}).toArray();

  if(posts.length === 0) {
    data.message = 'there is no post to schedule at this time';
    return data;
  }

  for (const post of posts) {
    let scheduleDate = moment(post.scheduleDate);
    if(moment().isAfter(scheduleDate)) {
      // Publish new post
      try {
        post.createdAt = post.scheduleDate;
        post.scheduleDate = 0;
        await Post.update({ _id: post._id }, post);
        console.log('Published: %s', post.title);
      } catch (e) {
        data.message = e.message;
        return data;
      }

      // Refresh featured general post
      try {
        await got.put('https://api.ameinfo.com/settings/featured-general/refresh');
      } catch (e) {
        data.message = e.message;
        return data;
      }
    }
  }

  return data;
};
