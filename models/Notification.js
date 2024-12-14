const { DataTypes } = require("sequelize")
const sequelize = require("../db")

const Notification = sequelize.define(
  "Notification",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fromUser: { type: DataTypes.INTEGER, allowNull: false },
    toUser: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING },
    body: { type: DataTypes.TEXT },
    actions: { type: DataTypes.JSONB, defaultValue: [] },
    createdBy: { type: DataTypes.INTEGER },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "notification",
  }
)

module.exports = Notification
