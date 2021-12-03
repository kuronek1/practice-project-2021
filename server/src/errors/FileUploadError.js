const ApplicationError = require('./ApplicationError');

class FileUploadError extends ApplicationError{
  constructor (message) {
    super(message || 'cannot upload file', 406);
  }
}

module.exports = FileUploadError;

