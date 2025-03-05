import express from "express";
import Student from "../models/Student.js";
import { verifyToken } from "../middlewares/authMiddleware.js"; // Importa el middleware

const router = express.Router();

// Obtener todos los estudiantes (protegido)
router.get("/", verifyToken, async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un estudiante por ID (protegido)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ error: "Estudiante no encontrado" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un estudiante (protegido)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ error: "Estudiante no encontrado" });

    await student.update(req.body);
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un estudiante (soft delete, protegido)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ error: "Estudiante no encontrado" });

    await student.update({ deletedAt: new Date().toISOString() }); // Soft delete
    res.json({ message: "Estudiante eliminado correctamente (soft delete)" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
