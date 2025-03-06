import express from "express";
import { Sequelize } from "sequelize";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import { verifyToken } from "../config/jwt.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/without-conversation/:user_id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.user_id;

    if (!userId) {
      return res.status(400).json({ error: "El ID del usuario es necesario" });
    }

    // Consulta para obtener usuarios sin conversación con el usuario dado
    const usersWithoutConversation = await User.findAll({
      where: Sequelize.literal(`
        id NOT IN (
          SELECT participant_one_id FROM conversations WHERE participant_two_id = '${userId}'
          UNION
          SELECT participant_two_id FROM conversations WHERE participant_one_id = '${userId}'
        ) AND id != '${userId}'
      `),
      attributes: { exclude: ["password", "createdAt"] }, // Excluir los campos no deseados
    });

    res.json(usersWithoutConversation);
  } catch (error) {
    console.error("Error obteniendo usuarios sin conversación:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/with-conversation/:user_id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.user_id;

    if (!userId) {
      return res.status(400).json({ error: "El ID del usuario es necesario" });
    }

    // Consulta para obtener usuarios con conversación con el usuario dado
    const usersWithConversation = await User.findAll({
      where: Sequelize.literal(`
        id IN (
          SELECT participant_one_id FROM conversations WHERE participant_two_id = '${userId}'
          UNION
          SELECT participant_two_id FROM conversations WHERE participant_one_id = '${userId}'
        ) AND id != '${userId}'
      `),
      attributes: { exclude: ["password", "createdAt"] }, // Excluir los campos no deseados
    });

    res.json(usersWithConversation);
  } catch (error) {
    console.error("Error obteniendo usuarios con conversación:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
