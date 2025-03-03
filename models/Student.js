import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Student = sequelize.define(
  "Student",
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

    grade: {
        type: DataTypes.STRING,
        allowNull: false
    },

    createdAt: {
      type: DataTypes.DATE,
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

