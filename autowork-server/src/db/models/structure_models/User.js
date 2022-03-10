const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../../db.config');

const User = db.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[a-zA-Z]+[a-zA-Z0-9_]{5}[a-zA-Z0-9_]*/,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^(?=.*[0-9])[a-zA-Z0-9]{6,32}$/,
      },
    },
    auth_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    auth_code_creation_time: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    logged_in: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    employee_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: (user) => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
      },
      beforeBulkCreate: (users) => {
        users.forEach(
          (user) =>
            (user.password = bcrypt.hashSync(
              user.password,
              bcrypt.genSaltSync(),
            )),
        );
      },
      beforeUpdate: (user) => {
        if (user.changed('password')) {
          user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
        }
      },
    },
  },
);

module.exports = User;
