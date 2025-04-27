import express from "express";
import Quiz from "../models/Quiz.js";
import { verifyToken } from "../config/jwt.js";

const router = express.Router();

// Crear un nuevo quiz
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, class_id, question_ids, start_date, end_date, time_limit_minutes, feedback_enabled } = req.body;

    const quiz = await Quiz.create({
      title,
      class_id,
      question_ids,
      start_date,
      end_date,
      time_limit_minutes,
      feedback_enabled,
      createdAt: new Date(),
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los quizzes
router.get("/", verifyToken, async (req, res) => {
  try {
    const { class_id } = req.query;

    const where = {};
    if (class_id) where.class_id = class_id;

    const quizzes = await Quiz.findAll({ where });

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un quiz por ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz no encontrado" });

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un quiz
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz no encontrado" });

    await quiz.update(req.body);

    res.json({ message: "Quiz actualizado correctamente", quiz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un quiz
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Quiz.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Quiz no encontrado" });

    res.json({ message: "Quiz eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;