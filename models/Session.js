const { DataTypes } = require("sequelize")
const sequelize = require("../db")

const Session = sequelize.define(
  "Session",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    playerId: { type: DataTypes.INTEGER, allowNull: false },
    sectionId: { type: DataTypes.INTEGER, allowNull: false },
    gameId: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM("multi", "single"), allowNull: false },
    startTime: { type: DataTypes.DATE },
    endTime: { type: DataTypes.DATE },
    status: {
      type: DataTypes.ENUM("paid", "notPaid"),
      defaultValue: "notPaid",
    },
    amount: { type: DataTypes.DECIMAL(10, 2) },
    createdBy: { type: DataTypes.INTEGER },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "session",
  }
)

module.exports = Session
