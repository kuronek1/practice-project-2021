const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { RefreshToken } = require('../models');
const CONSTANTS = require('../constants');

const jwtSign = promisify(jwt.sign);
const jwtVerify = promisify(jwt.verify);

module.exports.generateTokenPair = async (data) => {
  const accessToken = await jwtSign(data, CONSTANTS.JWT_ACCESS_SECRET, {
    expiresIn: CONSTANTS.ACCESS_TOKEN_TIME,
  });
  const refreshToken = await jwtSign(data, CONSTANTS.JWT_REFRESH_SECRET, {
    expiresIn: CONSTANTS.REFRESH_TOKEN_TIME,
  });

  return {
    accessToken,
    refreshToken,
  };
};

module.exports.verifyAccessToken = async (token) => {
  return await jwtVerify(token, CONSTANTS.JWT_ACCESS_SECRET);
};

module.exports.verifyRefreshToken = async (token) => {
  return await jwtVerify(token, CONSTANTS.JWT_REFRESH_SECRET);
};

module.exports.saveRefreshToDB = async (token, userId) => {
  /* TODO save multiple refresh tokens*/
  return await RefreshToken.create({ value: token, userId });
};

module.exports.updateRefreshToken = async (token, newToken) => {
  const foundToken = await RefreshToken.findOne({ value: token });
  return await foundToken.update({ value: newToken });
};
