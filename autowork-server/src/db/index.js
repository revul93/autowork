const db = require('./db.config');
const { SetAssociation } = require('./models/Association');
const { SeedDb } = require('./data');

// set association between models and return db object
const GetDb = async () => {
  await SetAssociation();

  // in development: reset database then seed initial data
  if (process.env.NODE_ENV === 'development') {
    await db.sync({ force: true, alter: true });
    await SeedDb();
    // await db.sync();
  } else if (process.env.NODE_ENV === 'production') {
    await db.sync({ alter: true, force: true });
    await SeedDb();
  }

  return db;
};

module.exports = { GetDb };
