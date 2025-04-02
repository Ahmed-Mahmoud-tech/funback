const { DataTypes } = require("sequelize")
const sequelize = require("../db")
const User = require("./User")

const Request = sequelize.define(
  "Request",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fromUser: { type: DataTypes.INTEGER, allowNull: false },
    toUser: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    createdBy: { type: DataTypes.INTEGER },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "requests",
  }
)
Request.belongsTo(User, { as: "toUserInfo", foreignKey: "toUser" })
Request.belongsTo(User, { as: "fromUserInfo", foreignKey: "fromUser" })

module.exports = Request
