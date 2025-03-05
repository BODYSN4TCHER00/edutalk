import express from "express";
import Teacher from "../models/Teacher.js";
import { verifyToken } from "../config/jwt.js";

const router = express.Router();

// Obtener todos los profesores (protegido)
router.get("/", verifyToken, async (req, res) => {
  try {
    const teachers = await Teacher.findAll();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un profesor por ID (protegido)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Profesor no encontrado" });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo profesor (protegido)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { id, employee_id, department } = req.body;
    const teacher = await Teacher.create({
      id,
      employee_id,
      department,
      created_at: new Date().toISOString()
    });
    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un profesor (protegido)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Profesor no encontrado" });

    await teacher.update(req.body);
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un profesor (soft delete, protegido)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Profesor no encontrado" });

    await teacher.update({ deleted_at: new Date().toISOString() }); // Soft delete
    res.json({ message: "Profesor eliminado correctamente (soft delete)" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
