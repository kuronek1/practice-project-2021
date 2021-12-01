const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { RefreshToken } = require('../models');
const CONSTANTS = require('../constants');
const { prepareUser } = require('../utils/functions');

const jwtSign = promisify(jwt.sign);
const jwtVerify = promisify(jwt.verify);

const generateTokenPair = async (data) => {
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
module.exports.generateTokenPair = generateTokenPair;

module.exports.verifyAccessToken = async (token) => {
  return await jwtVerify(token, CONSTANTS.JWT_ACCESS_SECRET);
};

module.exports.verifyRefreshToken = async (token) => {
  return await jwtVerify(token, CONSTANTS.JWT_REFRESH_SECRET);
};

const saveRefreshToDB = async (token, userId) => {
  /* TODO save multiple refresh tokens*/
  return await RefreshToken.create({ value: token, userId });
};
module.exports.saveRefreshToDB = saveRefreshToDB;

module.exports.createSession = async (data) => {
  const tokenPair = await generateTokenPair(
    prepareUser({ ...data, userId: data.id })
  );

  await saveRefreshToDB(tokenPair.refreshToken, data.id);

  return tokenPair;
};

module.exports.updateRefreshToken = async (token, newToken) => {
  const foundToken = await RefreshToken.findOne({ value: token });
  return await foundToken.update({ value: newToken });
};
