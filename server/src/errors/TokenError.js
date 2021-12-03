const ApplicationError = require('./ApplicationError');

class TokenError extends ApplicationError{
  constructor (message) {
    super(message || 'token error', 403);
  }
}

module.exports = TokenError;

