const passport = require('passport');
module.exports = async (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, user) => {
    if(error) {
      return res.badRequest(error);
    }

    if(!user) {
      return res.serverError({ message: 'unauthorized' });
    }

    req.user = user;
    return next();
  })(req, res);
};
