import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Submission = sequelize.define(
  "Submission",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    student_id: {
        type: DataTypes.UUID,
        references: {
          model: "students",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },

    assignment_id: {
        type: DataTypes.UUID,
        references: {
          model: "assignments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },

    file_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    createdAt: {
      type: DataTypes.DATE,
        defaultValue: Date.now(),
        allowNull: false
    },

    grade: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    
  },
  {
    timestamps: false,
    tableName: "submissions",
  },
);

export default Submission;

