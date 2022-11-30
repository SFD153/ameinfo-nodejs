const moment = require('moment');
const { unserialize } = require('php-unserialize');
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : '',
    database : 'ameinfo-prod'
  }
});

module.exports = {
  async migrateData () {
    let count = 0;
    let userAccount;

    // Get all users from database
    try {
      userAccount = await knex('wp_users').select('ID', 'user_login', 'user_pass', 'user_email', 'user_registered');
    } catch (e) {
      console.error(e);
    }

    // Get user id from list of user
    const listOfuserId = _.map(userAccount, 'ID');

    // Get user firstname and lastname and biographical information
    let userInformation;

    try {
      userInformation = await knex('wp_usermeta')
        .select('user_id', 'meta_key', 'meta_value')
        .whereIn('user_id', listOfuserId)
        .whereIn('meta_key', ['first_name', 'last_name', 'description', 'wp_capabilities']);
    } catch (e) {
      console.error(e);
    }

    // Merge user account and user infromation
    const users = _.map(userAccount, account => {
      const username = account.user_login.toLowerCase();
      const password = account.user_pass;
      const email = account.user_email.toLowerCase();
      const userRegistered = moment(account.user_registered, 'YYYY-MM-DD HH:mm:ss').valueOf();
      const userInfo = _.filter(userInformation, { 'user_id': account.ID });
      const firstName = _.get(_.find(userInfo, { 'meta_key': 'first_name' }), 'meta_value');
      const lastName = _.get(_.find(userInfo, { 'meta_key': 'last_name' }), 'meta_value');
      const biographicalInfo = _.get(_.find(userInfo, { 'meta_key': 'description' }), 'meta_value');
      const WPRole = _.get(_.find(userInfo, { 'meta_key': 'wp_capabilities' }), 'meta_value');
      const WPRoleName = _.first(_.keys(unserialize(WPRole)));
      const roles = ['subscriber', 'contributor', 'editor', 'author', 'administrator'];

      let roleName = WPRoleName;
      if(!roles.includes(WPRoleName)) {
        roleName = 'subscriber';
      }

      return {
        username,
        password,
        email,
        firstName,
        lastName,
        biographicalInfo,
        activationKey: '',
        status: 0,
        roleName,
        avatar: null,
        createdAt: userRegistered,
        updatedAt: userRegistered,
      };
    });

    // Save user into mongodb database

    for(const user of users) {
      // Get role by role name
      let role;
      try {
        role = await Role.findOne({ name: user.roleName });
      } catch (e) {
        console.error(e);
        break;
      }

      // Save user into database
      let data = _.omit(user, 'roleName');

      try {
        await User.create({ ...data, role: role.id }).fetch();
      } catch (e) {
        console.error(e);
      }

      count++;
      console.log('%s user has been migrated', count);
    }
  }
}
