const express = require('express');
const cors = require('cors');
const router = require('./router');
const handlerError = require('./handlerError/handler');
const constants = require('./constants');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/public', express.static(constants.FILES_PATH));

/* app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
}); */
/* Path: / */
app.use(router);
app.use(handlerError);

module.exports = app;
