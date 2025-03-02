const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const PushToken = sequelize.define(
  "PushToken",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "push_tokens",
    timestamps: false,
  }
);

module.exports = PushToken;
