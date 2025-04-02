const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Notification = sequelize.define(
  "Notification",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    from_user: { type: DataTypes.INTEGER, allowNull: false },
    to_user: { type: DataTypes.INTEGER, allowNull: false },
    notification_type: { type: DataTypes.STRING, allowNull: false },
    body: { type: DataTypes.JSONB, allowNull: true },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdBy: { type: DataTypes.INTEGER },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "notification",
  }
);

module.exports = Notification;
