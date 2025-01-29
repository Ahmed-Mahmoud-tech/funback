const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Game = require("./Game");
const Session = sequelize.define(
  "Session",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    playerId: { type: DataTypes.INTEGER, allowNull: false },
    sectionId: { type: DataTypes.INTEGER, allowNull: false },
    gameId: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    startTime: { type: DataTypes.DATE },
    endTime: { type: DataTypes.DATE },
    ownerId: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.STRING,
      defaultValue: "notPaid",
    },
    amount: { type: DataTypes.DECIMAL(10, 2) },
    createdBy: { type: DataTypes.INTEGER },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "sessions",
  }
);

Session.belongsTo(Game, {
  foreignKey: "gameId", // The foreign key in the Session model
  onDelete: "CASCADE", // Enable cascade delete
  onUpdate: "CASCADE", // Enable cascade update
});

module.exports = Session;
