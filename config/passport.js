const passport = require('passport');
const passportJwt = require('passport-jwt');
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, cb) => {
  let user;
  try {
    user = await User.findOne({ email }).populate('role').populate('avatar');
  } catch (error) {
    return cb(error);
  }

  if(!user) {
    return cb(null, false, { message: 'Incorrect email or password' });
  }

  let matchedPassword = await PasswordService.comparePassword(password, user.password);
  if(!matchedPassword) {
    return cb(null, false, { message: 'Incorrect email or password' });
  }

  let data = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role.name,
    avatar: user.avatar,
  };

  let token = JWTService.issuer(data, '1 day');

  return cb(null, { token }, { message: 'logged in successfully' });
}));

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: '488db7bdde4a1140af5d837a07ebbe87'
}, async (payload, cb) => {
  try {
    let result = await User.findOne(payload.id);
    return cb(null, result);
  } catch (error) {
    return cb(error);
  }
}));
