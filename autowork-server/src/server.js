const nconf = require('nconf');
const app = require('./app');
const { get_db } = require('./db');

const HOSTNAME = process.env.HOSTNAME || 'localhost';
const PORT = process.env.PORT || '5000';

const main = async () => {
  nconf.file('config', {
    file: 'src/config.json',
    secure: {
      secret: process.env.CONFIG_SECRET || 'OD3d8AQ6DG65UHxOJw7McjJV3WvcCcGe',
    },
  });
  try {
    await get_db();
    console.log(`database connected`);
  } catch (error) {
    console.error(error);
    return -1;
  }

  app.listen(PORT, () => {
    console.log(
      `${process.env.NODE_ENV} server started at http://${HOSTNAME}:${PORT}/`,
    );
  });
};

main();
