const jwt = require('jsonwebtoken');

const configuration = require('../configs/configuration');
const userModel = require('../models/user.model');
const ErrorResponse = require('../helpers/ErrorResponse');
const employeeModel = require('../models/employee.model');
const statusUser = require('../constants/statusUser');

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ErrorResponse(403, 'Unauthorized');
  }

  const token = authorization.split(' ')[1];
  const decode = jwt.verify(token, configuration.SECRET_KEY);

  let account = await userModel.findById(decode._id).select('-password');
  if (!account) {
    account = await employeeModel.findById(decode._id).select('-password');
    if (!account) {
      throw new ErrorResponse(403, 'Unauthorized');
    }
  }

  if (account.status !== statusUser.Activated) {
    throw new ErrorResponse(403, 'Unauthorized');
  }

  req.user = account;
  next();
};
