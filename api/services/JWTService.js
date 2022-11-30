const jwt = require('jsonwebtoken');
const SECRET = '488db7bdde4a1140af5d837a07ebbe87';

module.exports = {
  issuer(payload, expiresIn) {
    return jwt.sign(payload, SECRET, {
      expiresIn: expiresIn
    });
  },
  verify(token) {
    return jwt.verify(token, SECRET);
  }
}
