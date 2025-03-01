import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: "User",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    enrollment: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    grade: {
        type: DataTypes.STRING,
        allowNull: false
    },

    createdAt: {
        defaultValue: Date.now(),
        allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: "students",
  },
);

export default Student;

