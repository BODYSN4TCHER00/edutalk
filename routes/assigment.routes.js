import express from "express";
import Assignment from "../models/Assignment.js";
import { verifyToken } from "../config/jwt.js";
import { Op } from "sequelize";

const router = express.Router();

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ error: "Tarea no encontrada" });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/course/:course_id", verifyToken, async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      where: { course_id: req.params.course_id },
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, course_id, delivery_date } = req.body;

    const assignment = await Assignment.create({
      title,
      description,
      course_id,
      delivery_date,
      createdAt: new Date(),
      status: true,
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, description, delivery_date, status } = req.body;
    const assignment = await Assignment.findByPk(req.params.id);

    if (!assignment) return res.status(404).json({ error: "Tarea no encontrada" });

    await assignment.update({
      title,
      description,
      delivery_date,
      status,
    });

    res.json({ message: "Tarea actualizada correctamente", assignment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Assignment.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) return res.status(404).json({ error: "Tarea no encontrada" });

    res.json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/status/:id", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const assignment = await Assignment.findByPk(req.params.id);

    if (!assignment) return res.status(404).json({ error: "Tarea no encontrada" });

    await assignment.update({ status });

    res.json({ message: "Estado de la tarea actualizado correctamente", assignment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
