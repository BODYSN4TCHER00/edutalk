import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Conversation = sequelize.define(
  "Conversation",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },

    participant_one_id: {
      type: DataTypes.UUID,
      references: {
        model: "User",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    
    participant_two_id: {
      type: DataTypes.UUID,
      references: {
        model: "User",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    created_at: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: Date.now()
    }
  },
  {
    timestamps: false,
    tableName: "conversations",
  },
);

export default Conversation;