const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { RefreshToken, Users: User } = require('../models');
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
  return await RefreshToken.create({ value: token, userId });
};
module.exports.saveRefreshToDB = saveRefreshToDB;

module.exports.createSession = async (data) => {
  const tokenPair = await generateTokenPair(
    prepareUser({ ...data, userId: data.id })
  );

  // const user = User.findOne({ where: { id: data.id } });
  const tokens = await RefreshToken.count({ where: { userId: data.id } });

  // if ((await user.countRefreshTokens()) >= CONSTANTS.MAX_DEVICE_AMOUNT) {
  if (tokens >= CONSTANTS.MAX_DEVICE_AMOUNT) {
    /* const [oldestToken] = await user.getRefreshTokens({
      order: [['updatedAt', 'ASC']],
    }); */
    const [oldestToken] = await RefreshToken.findAll({
      where: { userId: data.id },
      order: [['updatedAt', 'ASC']],
    });

    oldestToken.update({ value: tokenPair.refreshToken });
  } else {
    await saveRefreshToDB(tokenPair.refreshToken, data.id);
  }

  return tokenPair;
};
