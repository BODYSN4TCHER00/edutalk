import express from "express";
import Question from "../models/Question.js";
import { verifyToken } from "../config/jwt.js";

const router = express.Router();

// Crear una nueva pregunta
router.post("/", verifyToken, async (req, res) => {
  try {
    const { text, type, options, correct_answer, topic, difficulty, teacher_id } = req.body;

    const question = await Question.create({
      text,
      type,
      options,
      correct_answer,
      topic,
      difficulty,
      teacher_id,
      createdAt: new Date(),
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las preguntas
router.get("/", verifyToken, async (req, res) => {
  try {
    const { teacher_id, topic, difficulty } = req.query;

    const where = {};
    if (teacher_id) where.teacher_id = teacher_id;
    if (topic) where.topic = topic;
    if (difficulty) where.difficulty = difficulty;

    const questions = await Question.findAll({ where });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una pregunta por ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);
    if (!question) return res.status(404).json({ error: "Pregunta no encontrada" });

    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una pregunta
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);
    if (!question) return res.status(404).json({ error: "Pregunta no encontrada" });

    await question.update(req.body);

    res.json({ message: "Pregunta actualizada correctamente", question });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una pregunta
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Question.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Pregunta no encontrada" });

    res.json({ message: "Pregunta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
