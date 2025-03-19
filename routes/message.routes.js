import express from "express";
import Message from "../models/Message.js";
import { verifyToken } from "../config/jwt.js";
import { Op } from "sequelize";

const router = express.Router();

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) return res.status(404).json({ error: "Mensaje no encontrado" });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/conversation/:conversation_id", verifyToken, async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { conversation_id: req.params.conversation_id },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { conversation_id, sender_id, content } = req.body;
    
    const message = await Message.create({
      conversation_id,
      sender_id,
      content,
      sent_at: new Date().toISOString(),
    });

    req.io.emit(`chat.conversation.${conversation_id}`, message);
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Message.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ error: "Mensaje no encontrado" });
    res.json({ message: "Mensaje eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/mark-as-read/:userId/:conversationId", verifyToken, async (req, res) => {
  try {
    const { userId, conversationId } = req.params;

    // Actualizar los mensajes no leídos de la conversación específica
    const [updatedCount] = await Message.update(
      { state: "Seen" },
      {
        where: {
          state: "Unread",              // Solo los mensajes "Unread"
          sender_id: { [Op.ne]: userId }, // Excluir los mensajes enviados por el usuario
          conversation_id: conversationId, // Filtrar por la conversación específica
        },
      }
    );

    req.io.emit(`chat.messages.read.${conversationId}`, {
      user_id: userId,
      state: "Seen"
    });

    if (updatedCount === 0) {
      return res.status(404).json({ message: "No hay mensajes pendientes por leer en esta conversación" });
    }

    res.json({ message: "Mensajes de la conversación actualizados correctamente", updatedCount });
  } catch (error) {
    console.error("Error actualizando los mensajes:", error);
    res.status(500).json({ error: error.message });
  }
});


router.patch("/state/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;

    const validStates = ["Unread", "Seen", "Pending"];
    if (!validStates.includes(state)) {
      return res.status(400).json({ error: "Invalid state" });
    }

    const message = await Message.findByPk(id);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    await message.update({ state });

    req.io.emit('chat.message.state', {
      message_id: id,
      state,
      conversation_id: message.conversation_id
    });

    res.json({ message: "Message state updated successfully", updatedMessage: message });
  } catch (error) {
    console.error("Error updating message state:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
