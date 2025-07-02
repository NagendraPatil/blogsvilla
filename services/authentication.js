const JWT = require("jsonwebtoken");
const secret = "MrNags";

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    pfpURL: user.pfpURL,
    role: user.role,
  };
  const token = JWT.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = { createTokenForUser, validateToken };
