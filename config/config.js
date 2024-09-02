require("dotenv").config();
module.exports = {
  development: {
    DATABASE_URL: process.env.DATABASE_URL,
    options: {
      dialect: "postgres",
      dialectOptions: {
        ssl: true,
      },
    },
  },
  production: {
    DATABASE_URL: process.env.DATABASE_URL,
    options: {
      dialect: "postgres",
      dialectOptions: {
        ssl: true,
      },
    },
  },
};
