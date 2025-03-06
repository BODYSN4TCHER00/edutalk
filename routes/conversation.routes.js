import express from "express";
import Conversation from "../models/Conversation.js";
import { verifyToken } from "../config/jwt.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const conversations = await Conversation.findAll();
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const conversation = await Conversation.findByPk(req.params.id);
    if (!conversation) return res.status(404).json({ error: "Conversación no encontrada" });
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/user/:user_id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.user_id;

    if (!userId) {
      return res.status(400).json({ error: "Id is necessary" });
    }

    const conversations = await Conversation.findAll({
      where: Sequelize.literal(`"participant_one_id" = '${userId}' OR "participant_two_id" = '${userId}'`)
    });

    if (!conversations || conversations.length === 0) {
      return res.status(404).json({ error: "Conversation was not found" });
    }

    res.json(conversations);
  } catch (error) {
    console.error("Error getting conversations:", error);
    res.status(500).json({ error: error.message });
  }
});



router.post("/", verifyToken, async (req, res) => {
  try {
    const { id, participant_one_id, participant_two_id } = req.body;

    if (participant_one_id === participant_two_id) {
      return res.status(400).json({ error: "Los participantes deben ser diferentes" });
    }

    const conversation = await Conversation.create({
      id,
      participant_one_id,
      participant_two_id,
      created_at: new Date().toISOString(),
    });

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const conversation = await Conversation.findByPk(req.params.id);
    if (!conversation) return res.status(404).json({ error: "Conversación no encontrada" });

    await conversation.update({ deleted_at: new Date().toISOString() });
    res.json({ message: "Conversación eliminada correctamente (soft delete)" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
