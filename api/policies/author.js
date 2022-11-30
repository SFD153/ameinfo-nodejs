module.exports = async (req, res, next) => {
  try {
    await RoleService.checkRole(req.user, 'author');
    return next();
  } catch (error) {
    return res.badRequest(ErrorService.responseError(error.message));
  }
};
