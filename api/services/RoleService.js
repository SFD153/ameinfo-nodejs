module.exports = {
  async checkRole(userId, roleName) {
    // Find user
    let user = await User.findOne(userId).populate('role');
    if(!user) {
      throw new Error('invalid credentials');
    }

    // Get role from user and then check it
    let role = user.role;
    if(!role) {
      throw new Error('invalid authorization');
    }

    if(role.name !== roleName) {
      throw new Error('you have no permissions to access this resource.');
    }
  }
};
