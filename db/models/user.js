"use strict";
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [1, 99],
            msg: "Invalid user name. Musct be between 1 and 99 characters",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: { msg: "Invalid email address" },
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [8, 99],
            msg: "Password must be at least 8 characters.",
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate: function (user, options) {
          if (user && user.password) {
            let hash = bcrypt.hashSync(user.password, 12);
            user.password = hash;
          }
        },
      },
    },
  );
  user.associate = function (models) {
    // associations can be defined here
    models.user.hasMany(models.collection);
  };
  // Function to compare entered password to hashed password
  user.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  // Function to remove password before sending the user object
  user.prototype.toJSON = function () {
    let userData = this.get();
    delete userData.password;
    return userData;
  };
  return user;
};

