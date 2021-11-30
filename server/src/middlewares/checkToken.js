const _ = require('lodash');
const TokenError = require('../errors/TokenError');
const userQueries = require('../controllers/queries/userQueries');
const { verifyAccessToken } = require('../services/jwt.service');

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
    const tokenData = await verifyAccessToken(accessToken);
    const foundUser = await userQueries.findUser({ id: tokenData.userId });

    res.send({
      ..._.omit(foundUser, ['password']),
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
    req.tokenData = await verifyAccessToken(accessToken);
    next();
  } catch (err) {
    next(new TokenError());
  }
};
