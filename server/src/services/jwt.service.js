const jwt = require('jsonwebtoken');
const { promisify } = require('util');
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
