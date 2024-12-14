const { DataTypes } = require("sequelize")
const sequelize = require("../db")

const Section = sequelize.define(
  "Section",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sectionName: { type: DataTypes.STRING, allowNull: false },
    ownerId: { type: DataTypes.INTEGER, allowNull: false },
    createdBy: { type: DataTypes.INTEGER },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "sections",
  }
)

module.exports = Section
