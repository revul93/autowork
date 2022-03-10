const { Sequelize } = require('sequelize');

// development database
const dev_db = new Sequelize({
  dialect: 'sqlite',
  storage: 'storage/db/autowork-dev-db.sqlite',
  logging: false,
});

// production database
const prod_db = new Sequelize({
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  dialect: 'postgres',
  logging: console.log,
});

const db =
  process.env.NODE_ENV === 'development'
    ? dev_db
    : process.env.NODE_ENV === 'production'
    ? prod_db
    : undefined;

module.exports = db;
