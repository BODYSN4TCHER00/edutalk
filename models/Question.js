import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Question = sequelize.define(
  "Question",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM("multiple_choice", "true_false", "open_ended"),
      allowNull: false,
    },

    options: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },

    correct_answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    topic: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    difficulty: {
      type: DataTypes.ENUM("easy", "medium", "hard"),
      allowNull: true,
    },

    teacher_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "teachers", // Assuming "users" table for teachers
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
  },
  {
    timestamps: false,
    tableName: "questions",
  }
);

export default Question;
