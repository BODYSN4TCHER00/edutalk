import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },

    conversation_id: {
      type: DataTypes.UUID,
      references: {
        model: "Conversation",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    
    sender_id: {
      type: DataTypes.UUID,
      references: {
        model: "User",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    content: {
        type: DataTypes.STRING,
        allowNull: false
    },

    sent_at: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: Date.now()
    }
  },
  {
    timestamps: false,
    tableName: "messages",
  },
);

export default Message;