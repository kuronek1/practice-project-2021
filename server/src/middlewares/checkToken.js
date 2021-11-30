const jwt = require('jsonwebtoken');
const CONSTANTS = require('../constants');
const TokenError = require('../errors/TokenError');
const userQueries = require('../controllers/queries/userQueries');

module.exports.checkAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new TokenError('Need token'));
  }
  const [type, accessToken] = req.headers.authorization.split(' ');
  /* TODO Bearer type */
  if (type !== 'Bearer' || !accessToken) {
    return next(new TokenError('Need token'));
  }
  try {
    const tokenData = jwt.verify(accessToken, CONSTANTS.JWT_ACCESS_SECRET);
    const foundUser = await userQueries.findUser({ id: tokenData.userId });
    res.send({
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      role: foundUser.role,
      id: foundUser.id,
      avatar: foundUser.avatar,
      displayName: foundUser.displayName,
      balance: foundUser.balance,
      email: foundUser.email,
    });
  } catch (err) {
    next(new TokenError());
  }
};

module.exports.checkToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new TokenError('Need token'));
  }
  const [type, accessToken] = req.headers.authorization.split(' ');
  /* TODO Bearer type */
  if (type !== 'Bearer' || !accessToken) {
    return next(new TokenError('Need token'));
  }
  try {
    req.tokenData = jwt.verify(accessToken, CONSTANTS.JWT_ACCESS_SECRET);
    next();
  } catch (err) {
    next(new TokenError());
  }
};
