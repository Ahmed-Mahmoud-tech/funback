// const { Sequelize } = require("sequelize")
// require("dotenv").config()

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: "postgres",
//   }
// )

// module.exports = sequelize

const { Sequelize } = require("sequelize")
require("dotenv").config()

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: false, // Enforce SSL connection
        rejectUnauthorized: false, // Skip certificate validation
      },
    },
  }
)

module.exports = sequelize
