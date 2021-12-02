const _ = require('lodash');
const TokenError = require('../errors/TokenError');
const RefreshTokenError = require('../errors/RefreshTokenError');
const userQueries = require('../controllers/queries/userQueries');
const {
  verifyAccessToken,
  verifyRefreshToken,
} = require('../services/jwt.service');

module.exports.checkAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new TokenError('Need token'));
  }
  const [type, accessToken] = req.headers.authorization.split(' ');
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

module.exports.checkAccessToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new TokenError('Need token'));
  }
  const [type, accessToken] = req.headers.authorization.split(' ');
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

module.exports.checkRefreshToken = async (req, res, next) => {
  if (!req.body.refreshToken) {
    return next(new TokenError('Need token'));
  }
  const { refreshToken } = req.body;

  try {
    req.tokenData = await verifyRefreshToken(refreshToken);
    next();
  } catch (err) {
    next(new RefreshTokenError());
  }
};
