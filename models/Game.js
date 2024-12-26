const { DataTypes } = require("sequelize")
const sequelize = require("../db")

const Game = sequelize.define(
  "Game",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    ownerId: { type: DataTypes.INTEGER, allowNull: false },
    singlePrice: { type: DataTypes.DECIMAL(10, 2) },
    multiPrice: { type: DataTypes.DECIMAL(10, 2) },
    createdBy: { type: DataTypes.INTEGER },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "game",
  }
)

module.exports = Game
