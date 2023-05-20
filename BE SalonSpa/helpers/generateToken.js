const ErrorResponse = require('./ErrorResponse');
const jwt = require('jsonwebtoken');

// Define a custom character set with 32 characters
const charSet = '0123456789abcdefghijklmnopqrstuvwxyz';

const generateToken = (payload, secret) => {
  const token = jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: '10h',
  });

  return token;
};

const verifyToken = (token, secret) => {
  // Verify the token signature
  try {
    const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
    return payload;
  } catch (error) {
    throw new ErrorResponse(error);
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
