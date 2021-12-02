const ApplicationError = require('./ApplicationError');

class RefreshTokenError extends ApplicationError{
  constructor (message) {
    super(message || 'refresh token error', 419);
  }
}

module.exports = RefreshTokenError;

