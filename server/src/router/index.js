const express = require('express');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const hashPass = require('../middlewares/hashPassMiddle');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const contestController = require('../controllers/contestController');
const {
  checkAccessToken,
  checkAuth,
  checkRefreshToken,
} = require('../middlewares/checkToken');
const validators = require('../middlewares/validators');
const chatController = require('../controllers/chatController');
const upload = require('../utils/fileUpload');
const router = express.Router();

// TODO:refactor http methods
// TODO:add routes

/* Auth */
router.post(
  '/registration',
  validators.validateRegistrationData,
  hashPass,
  authController.registration
);

router.post('/login', validators.validateLogin, authController.login);

router.patch('/refresh', checkRefreshToken, authController.refreshTokens);

/* Contests */
router.post(
  '/dataForContest',
  checkAccessToken,
  contestController.dataForContest
);

router.post(
  '/pay',
  checkAccessToken,
  basicMiddlewares.onlyForCustomer,
  upload.uploadContestFiles,
  basicMiddlewares.parseBody,
  validators.validateContestCreation,
  userController.payment
);

router.post(
  '/getCustomersContests',
  checkAccessToken,
  contestController.getCustomersContests
);

router.get(
  '/getContestById',
  checkAccessToken,
  basicMiddlewares.canGetContest,
  contestController.getContestById
);

router.post(
  '/getAllContests',
  checkAccessToken,
  basicMiddlewares.onlyForCreative,
  contestController.getContests
);

router.get(
  '/downloadFile/:fileName',
  checkAccessToken,
  contestController.downloadFile
);

router.post(
  '/updateContest',
  checkAccessToken,
  upload.updateContestFile,
  contestController.updateContest
);

/* Offer */
router.post(
  '/setNewOffer',
  checkAccessToken,
  upload.uploadLogoFiles,
  basicMiddlewares.canSendOffer,
  contestController.setNewOffer
);

router.post(
  '/setOfferStatus',
  checkAccessToken,
  basicMiddlewares.onlyForCustomerWhoCreateContest,
  contestController.setOfferStatus
);

router.post(
  '/changeMark',
  checkAccessToken,
  basicMiddlewares.onlyForCustomer,
  userController.changeMark
);

/* User */
router.post('/getUser', checkAuth);

router.post(
  '/updateUser',
  checkAccessToken,
  upload.uploadAvatar,
  userController.updateUser
);

router.post(
  '/cashout',
  checkAccessToken,
  basicMiddlewares.onlyForCreative,
  userController.cashout
);

/* Chat */
router.post('/newMessage', checkAccessToken, chatController.addMessage);

router.post('/getChat', checkAccessToken, chatController.getChat);

router.post('/getPreview', checkAccessToken, chatController.getPreview);

router.post('/blackList', checkAccessToken, chatController.blackList);

router.post('/favorite', checkAccessToken, chatController.favoriteChat);

/* Catalog */
router.post('/createCatalog', checkAccessToken, chatController.createCatalog);

router.post(
  '/updateNameCatalog',
  checkAccessToken,
  chatController.updateNameCatalog
);

router.post(
  '/addNewChatToCatalog',
  checkAccessToken,
  chatController.addNewChatToCatalog
);

router.post(
  '/removeChatFromCatalog',
  checkAccessToken,
  chatController.removeChatFromCatalog
);

router.post('/deleteCatalog', checkAccessToken, chatController.deleteCatalog);

router.post('/getCatalogs', checkAccessToken, chatController.getCatalogs);

module.exports = router;
