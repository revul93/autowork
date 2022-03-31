const express = require('express');
const cors = require('cors');
const path = require('path');
const Logger = require('./middleware/logger.middleware');
const CustomHelmet = require('./middleware/custom_helmet.middleware');
const router = require('./routes/router');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CustomHelmet());
app.use(Logger());
app.use(router);

app.use(express.static(path.join(__dirname, '../../autowork-client/build')));
app.get('*', (req, res) => {
  return res.sendFile(
    path.join(__dirname, '../../autowork-client/build', 'index.html'),
  );
});

module.exports = app;
