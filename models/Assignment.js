import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Assignment = sequelize.define(
  "Assignment",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
       allowNull: false,
    },

    course_id: {
        type: DataTypes.UUID,
        references: {
          model: "courses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },

    createdAt: {
      type: DataTypes.DATE,
        defaultValue: Date.now(),
        allowNull: false
    },

    delivery_date: {
      type: DataTypes.DATE,
      allowNull: false
    },

    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    
  },
  {
    timestamps: false,
    tableName: "assignments",
  },
);

export default Assignment;

