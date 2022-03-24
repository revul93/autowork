const helmet = require('helmet');

// DESCRIPTION: Custom helmet configuration
//  HelmetJS used for security and protection
const CustomHelmet = () =>
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https'],
        imgSrc: ["'self'", 'https'],
        fontSrc: [],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    frameguard: {
      action: 'deny',
    },
    hidePoweredBy: true,
    xssFilter: true,
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: {
      policy: 'no-referrer',
    },
    dnsPrefetchControl: {
      allow: false,
    },
  });

module.exports = CustomHelmet;
