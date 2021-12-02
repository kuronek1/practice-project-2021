const NotUniqueEmail = require('../errors/NotUniqueEmail');
const TokenError = require('../errors/TokenError');
const userQueries = require('./queries/userQueries');
const { createSession } = require('../services/jwt.service');
const { prepareUser } = require('../utils/functions');

module.exports.login = async (req, res, next) => {
  try {
    const foundUser = await userQueries.findUser({ email: req.body.email });
    await userQueries.passwordCompare(req.body.password, foundUser.password);

    const tokenPair = await createSession(foundUser);

    res.send({ tokenPair, data: prepareUser(foundUser) });
  } catch (err) {
    next(err);
  }
};

module.exports.registration = async (req, res, next) => {
  try {
    const newUser = await userQueries.userCreation(
      Object.assign(req.body, { password: req.hashPass })
    );

    const tokenPair = await createSession(newUser);

    res.send({ tokenPair, data: prepareUser(newUser) });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      next(new NotUniqueEmail());
    } else {
      next(err);
    }
  }
};

module.exports.refreshTokens = async (req, res, next) => {
  try {
    const {
      tokenData: { userId },
    } = req;

    const foundUser = await userQueries.findUser({ id: userId });

    const tokenPair = await createSession(foundUser);

    res.status(201).send({ tokenPair, data: prepareUser(foundUser) });
  } catch (error) {
    next(new TokenError());
  }
};
