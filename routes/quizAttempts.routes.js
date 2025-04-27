import express from "express";
import QuizAttempt from "../models/QuizAttempt.js";
import { verifyToken } from "../config/jwt.js";

const router = express.Router();

// Crear un intento de quiz
router.post("/", verifyToken, async (req, res) => {
  try {
    const { quiz_id, student_id, responses, score, time_taken_minutes } = req.body;

    const attempt = await QuizAttempt.create({
      quiz_id,
      student_id,
      responses,
      score,
      time_taken_minutes,
      submitted_at: new Date(),
    });

    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los intentos de un quiz
router.get("/quiz/:quiz_id", verifyToken, async (req, res) => {
  try {
    const attempts = await QuizAttempt.findAll({
      where: { quiz_id: req.params.quiz_id },
    });

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los intentos de un estudiante
router.get("/student/:student_id", verifyToken, async (req, res) => {
  try {
    const attempts = await QuizAttempt.findAll({
      where: { student_id: req.params.student_id },
    });

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un intento por ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const attempt = await QuizAttempt.findByPk(req.params.id);
    if (!attempt) return res.status(404).json({ error: "Intento no encontrado" });

    res.json(attempt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
