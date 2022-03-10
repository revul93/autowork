const morgan = require('morgan');
const winston = require('winston');
const expressWinston = require('express-winston');

// DESCRIPTION: winston logger for production environment
const winston_logger = () =>
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
    ),
    // optional: control whether you want to log the meta data about the request (default to true)
    meta: true,
    // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    msg: 'HTTP {{req.method}} {{req.url}}',
    // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    expressFormat: true,
    // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    colorize: false,
    // optional: allows to skip some log messages based on request and/or response
    ignoreRoute: (req, res) => {
      return false;
    },
  });

// DESCRIPTION: morgan logger for development environment
const morgan_logger = () => morgan('short');

if (process.env.NODE_ENV === 'development') {
  module.exports = morgan_logger;
} else {
  module.exports = winston_logger;
}
