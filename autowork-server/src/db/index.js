const db = require('./db.config');
const { setAssociation } = require('./models/Association');
const { seed_db } = require('./data');

// set association between models and return db object
const get_db = async () => {
  await setAssociation();

  // in development: reset database then seed initial data
  if (process.env.NODE_ENV === 'development') {
    // await db.sync({ force: true, alter: true });
    // await seed_db();
    await db.sync();
  } else if (process.env.NODE_ENV === 'production') {
    await db.sync({ alter: true, force: true });
    // await seed_db();
  }

  return db;
};

module.exports = { get_db };
