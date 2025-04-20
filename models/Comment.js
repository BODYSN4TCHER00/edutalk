import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author_id: {
      type: DataTypes.UUID,
      references: {
        model: "users",
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
  },
  {
    timestamps: true,
    tableName: "comments",
  }
);

Comment.belongsTo(User, {
  foreignKey: "author_id",
  as: "Author"
});

export default Comment;
