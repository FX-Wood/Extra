require("dotenv").config();
module.exports = {
  development: {
    DATABASE_URL: process.env.DATABASE_URL,
    options: {
      dialect: "postgres",
      logging: console.log,
      dialectOptions: {
        ssl: {
          require: true, // Ensure SSL is used
          rejectUnauthorized: false, // Accept self-signed certificates if needed
        },
      },
    },
  },
  test: {
    DATABASE_URL: process.env.DATABASE_URL_TEST,
    options: {
      dialect: "postgres",
      logging: console.log,
      dialectOptions: {
        ssl: {
          require: true, // Ensure SSL is used
          rejectUnauthorized: false, // Accept self-signed certificates if needed
        },
      },
    },
  },
  production: {
    DATABASE_URL: process.env.DATABASE_URL,
    options: {
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true, // Ensure SSL is used
          rejectUnauthorized: false, // Accept self-signed certificates if needed
        },
      },
    },
  },
};
