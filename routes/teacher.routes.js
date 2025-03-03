import express from "express";
import Teacher from "../models/Teacher.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.findAll();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Profesor no encontrado" });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
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

router.put("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Profesor no encontrado" });

    await teacher.update(req.body);
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
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
