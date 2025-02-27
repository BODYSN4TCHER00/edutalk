import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Teachers = sequelize.define(
  "Teachers",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: false,
    tableName: "teachers",
  },
);

export default Teachers;
