import express from "express";
import Enrollment from "../models/Enrollment.js";
import { verifyToken } from "../config/jwt.js";

const router = express.Router();

// Obtener todas las inscripciones de un estudiante
router.get("/student/:student_id", verifyToken, async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { student_id: req.params.student_id },
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las inscripciones de un curso
router.get("/course/:course_id", verifyToken, async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { course_id: req.params.course_id },
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inscribir un estudiante en un curso
router.post("/", verifyToken, async (req, res) => {
  try {
    const { student_id, course_id } = req.body;

    const enrollment = await Enrollment.create({
      student_id,
      course_id,
      status: true,
      createdAt: new Date(),
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar el estado de una inscripción (por ejemplo, si el estudiante ya no está inscrito)
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) return res.status(404).json({ error: "Inscripción no encontrada" });

    await enrollment.update({ status });

    res.json({ message: "Estado de la inscripción actualizado correctamente", enrollment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una inscripción
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Enrollment.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) return res.status(404).json({ error: "Inscripción no encontrada" });

    res.json({ message: "Inscripción eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
