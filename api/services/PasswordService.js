const hasher = require('wordpress-hash-node');
module.exports = {
  async hashPassword(password) {
    return await hasher.HashPassword(password);
  },

  async comparePassword(password, hash) {
    return await hasher.CheckPassword(password, hash);
  }
};
