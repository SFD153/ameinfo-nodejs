const jsonfile = require('jsonfile');
const path = require('path');
const fs = require('fs');
const PERMALINK_FILE = path.join(__dirname, '../resources', 'permalink.json');

// permalink file must create before import
let permalink;
if(!fs.existsSync(PERMALINK_FILE)) {
  jsonfile.writeFileSync(PERMALINK_FILE, {});
  permalink = require(PERMALINK_FILE);
} else {
  permalink = require(PERMALINK_FILE);
}

module.exports = {
  async build() {
    const categories = await Category
      .find()
      .populate('parent');

    const results = [];
    for( const category of categories ) {
      let data = {
        id: category.id,
        name: category.name,
      };

      if(_.isEmpty(category.parent)) {
        data.path = `/${category.slug}`;
      } else {
        data.path = `/${category.parent.slug}/${category.slug}`;
      }

      results.push(data);
    }

    await jsonfile.writeFile(PERMALINK_FILE, results);
  },

  find(id) {
    return _.find(permalink, { id });
  }
};
