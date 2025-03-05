import express from "express";
import Message from "../models/Message.js";
import { sendToQueue } from "../config/rabbitmq.js";
import { verifyToken } from "../middlewares/authMiddleware.js"; // Importa el middleware

const router = express.Router();

// Obtener un mensaje por ID (protegido)
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

    await sendToQueue(message);
    
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

export default router;
