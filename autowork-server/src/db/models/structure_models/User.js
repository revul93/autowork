const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../../db.config');
const { validate } = require('../../../utils');

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
      validate: validate.IsUsername,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: validate.IsPassword,
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
    is_logged_in: {
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
    timestamps: false,
  },
);

module.exports = User;
