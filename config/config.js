require('dotenv').config();
module.exports = {
    "development": {
        "DATABASE_URL": process.env.DATABASE_URL,
        "options": {
            "dialect": "postgres",
            "dialectOptions": {
                "ssl": true
            }
        }
    },
    "test": {
        "username": process.env.DB_USERNAME,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_TEST,
        "host": "127.0.0.1",
        "dialect": "postgres"
    },
    "production": {
        "use_env_variable": process.env.DATABASE_URL,
        "options": {
            "dialect": "postgres",
            "dialectOptions": {
                "ssl": true
            }
        }
    }
}

