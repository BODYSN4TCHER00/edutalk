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
      allowNull: false,
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
      allowNull: false,
    },

    delivery_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    assignment_type: {
      type: DataTypes.ENUM("file", "quiz"),
      allowNull: false,
      defaultValue: "file",
    },

    file_url: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },

    quiz_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "quizzes",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
  },
  {
    timestamps: false,
    tableName: "assignments",
  }
);

export default Assignment;
