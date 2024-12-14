const { DataTypes } = require("sequelize")
const sequelize = require("../db")

const User = sequelize.define(
  "User",
  {
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    type: { type: DataTypes.ENUM("owner", "employee"), allowNull: true },
    phoneNumber: { type: DataTypes.STRING },
    placeName: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    employeeRequest: { type: DataTypes.BOOLEAN, defaultValue: true },
    reservation: { type: DataTypes.BOOLEAN, defaultValue: true },
    session: { type: DataTypes.BOOLEAN, defaultValue: true },
    purchasesItems: { type: DataTypes.BOOLEAN, defaultValue: true },
    playersPurchases: { type: DataTypes.BOOLEAN, defaultValue: true },
    checkout: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdBy: { type: DataTypes.INTEGER },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "users",
  }
)

module.exports = User
