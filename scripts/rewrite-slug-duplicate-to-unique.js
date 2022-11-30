module.exports = {


  friendlyName: 'Rewrite slug duplicate to unique',


  description: 'It will rewrite all slug are duplicate to database',


  inputs: {

  },


  fn: async function (inputs, exits) {

    const db = Post.getDatastore().manager;
    const collection = db.collection(Post.tableName);
    const slugs = await collection.aggregate(
      {'$group' : { '_id': '$slug', 'count': { '$sum': 1 } } },
      {'$match': {'_id' :{ '$ne' : null } , 'count' : {'$gt': 1} } },
      {'$project': {'name' : '$_id', '_id' : 0} }
    ).toArray();

    let count = 0;
    for( const item of slugs ) {
      const posts = await Post.find({ slug: item._id });
      let duplicateCount = 0;
      for(const post of posts) {
        try {
          post.slug = post.slug.concat('-').concat(duplicateCount);
          await Post.update({ id: post.id }, post);

          // Increate duplicate count
          duplicateCount++;

          // Print number of post success
          count++;
          console.log('%s post has been rewrited unique slug', count);
        } catch (e) {
          console.error(e);
          process.exit(1);
          break;
        }
      }
    }

    // All done.
    return exits.success();

  }


};

