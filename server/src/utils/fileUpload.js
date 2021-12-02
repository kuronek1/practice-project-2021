const fs = require('fs');
const multer = require('multer');
const ServerError = require('../errors/ServerError');
const constants = require('../constants');
const FileUploadError = require('../errors/FileUploadError');
const env = process.env.NODE_ENV || 'development';

const filePath = env === 'production'
  ? '/var/www/html/images/'
  : `${constants.FILES_PATH}`;

if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath, {
    recursive: true,
  });
}

const storageAvatarFiles = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, `${filePath}/images/avatars`);
  },
  filename (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const storageContestFiles = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, `${filePath}/images`);
  },
  filename (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const uploadAvatars = multer({ storage: storageAvatarFiles }).single('file');
const updateContestFile = multer({ storage: storageContestFiles }).single('file');
const uploadContestFiles = multer({ storage: storageContestFiles }).array(
  'files', 3);
const uploadLogoFiles = multer({ storage: storageContestFiles }).single(
  'offerData');

module.exports.uploadAvatar = (req, res, next) => {
  uploadAvatars(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      next(new FileUploadError(''));
    } else if (err) {
      next(new ServerError());
    }
    return next();
  });
};

module.exports.uploadContestFiles = (req, res, next) => {
  uploadContestFiles(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      next(new FileUploadError(''));
    } else if (err) {
      next(new ServerError());
    }
    return next();
  });
};

module.exports.updateContestFile = (req, res, next) => {
  updateContestFile(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      next(new FileUploadError(''));
    } else if (err) {
      next(new ServerError());
    }
    return next();
  });
};

module.exports.uploadLogoFiles = (req, res, next) => {
  uploadLogoFiles(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      next(new FileUploadError(''));
    } else if (err) {
      next(new ServerError());
    }
    return next();
  });
};

