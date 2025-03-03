import express from "express";
import Conversation from "../models/Conversation.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const conversations = await Conversation.findAll();
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const conversation = await Conversation.findByPk(req.params.id);
    if (!conversation) return res.status(404).json({ error: "Conversación no encontrada" });
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Search for a user's conversations
router.get("/user/:user_id", async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          { participant_one_id: req.params.user_id },
          { participant_two_id: req.params.user_id }
        ]
      }
    });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { id, participant_one_id, participant_two_id } = req.body;

    // Verificar que los dos participantes sean diferentes
    if (participant_one_id === participant_two_id) {
      return res.status(400).json({ error: "Los participantes deben ser diferentes" });
    }

    const conversation = await Conversation.create({
      id,
      participant_one_id,
      participant_two_id,
      created_at: new Date().toISOString(), // Guarda la fecha en formato ISO
    });

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const conversation = await Conversation.findByPk(req.params.id);
    if (!conversation) return res.status(404).json({ error: "Conversación no encontrada" });

    await conversation.update({ deleted_at: new Date().toISOString() }); // Soft delete
    res.json({ message: "Conversación eliminada correctamente (soft delete)" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
