import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

router.get("/:id", async (req, res) => {
    try {
      const message = await Message.findByPk(req.params.id);
      if (!message) return res.status(404).json({ error: "Mensaje no encontrado" });
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/conversation/:conversation_id", async (req, res) => {
    try {
      const messages = await Message.findAll({
        where: { conversation_id: req.params.conversation_id },
      });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }); 

  router.post("/", async (req, res) => {
    try {
      const { id, conversation_id, sender_id, content } = req.body;
      const message = await Message.create({
        id,
        conversation_id,
        sender_id,
        content,
        sent_at: new Date().toISOString(), // Guarda la fecha en formato ISO
      });
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Message.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ error: "Mensaje no encontrado" });
    res.json({ message: "Mensaje eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

export default router; 