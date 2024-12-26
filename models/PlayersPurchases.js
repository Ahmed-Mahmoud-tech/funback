const { DataTypes } = require("sequelize")
const sequelize = require("../db")

const PlayersPurchase = sequelize.define(
  "PlayersPurchase",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    playerId: { type: DataTypes.INTEGER, allowNull: false },
    ownerId: { type: DataTypes.INTEGER, allowNull: false },
    item: { type: DataTypes.INTEGER, allowNull: false },
    count: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.STRING,
      defaultValue: "notPaid",
    },
    createdBy: { type: DataTypes.INTEGER },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "players_purchases",
  }
)

module.exports = PlayersPurchase
