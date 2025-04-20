import express from "express";
import User from "../models/User.js"; 
import Comment from "../models/Comment.js";
import { verifyToken } from "../config/jwt.js";

const router = express.Router();

// Obtener todos los comentarios de una tarea
router.get("/assignment/:assignment_id", verifyToken, async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { assignment_id: req.params.assignment_id },
      order: [["createdAt", "ASC"]],
      raw: true
    });

    // Obtener usuarios relacionados manualmente
    const users = await User.findAll({
      where: {
        id: comments.map(c => c.author_id)
      },
      attributes: ['id', 'name'],
      raw: true
    });

    const commentsWithAuthors = comments.map(comment => ({
      ...comment,
      Author: users.find(u => u.id === comment.author_id) || null
    }));

    res.json(commentsWithAuthors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo comentario
router.post("/", verifyToken, async (req, res) => {
  try {
    const { content, assignment_id } = req.body;
    const author_id = req.user.id;

    const comment = await Comment.create({
      content,
      author_id,
      assignment_id
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un comentario (solo el autor o admin)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    // Verificar si el usuario es el autor o admin
    if (comment.author_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: "No autorizado" });
    }

    await comment.destroy();
    res.json({ message: "Comentario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
