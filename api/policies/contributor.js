module.exports = async (req, res, next) => {
  try {
    await RoleService.checkRole(req.user, 'contributor');
    return next();
  } catch (error) {
    return res.badRequest(ErrorService.responseError(error.message));
  }
};
