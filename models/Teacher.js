import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Teacher = sequelize.define(
  "Teacher",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    employee_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false
    },
    
    created_at: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: Date.now()
    }
  },
  {
    timestamps: false,
    tableName: "teachers",
  },
);

export default Teacher;
