const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./middleware/logger.middleware');
const custom_helmet = require('./middleware/custom_helmet.middleware');
const router = require('./routes/router');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(custom_helmet());
app.use(logger());
app.use(router);

module.exports = app;
