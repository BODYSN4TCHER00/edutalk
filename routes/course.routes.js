import express from "express";
import Course from "../models/Course.js";
import { verifyToken } from "../config/jwt.js";
import { Op } from "sequelize";
import sequelize from "../config/db.js";

const router = express.Router();

// Obtener todos los cursos
router.get("/", verifyToken, async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un curso por ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: "Curso no encontrado" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo curso (solo profesores)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, description, code, teacher_id } = req.body;

    const course = await Course.create({ name, description, code, teacher_id });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un curso (solo el profesor propietario)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { name, description, code } = req.body;
    const course = await Course.findByPk(req.params.id);

    if (!course) return res.status(404).json({ error: "Curso no encontrado" });

    await course.update({ name, description, code });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un curso (solo el profesor propietario)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Course.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) return res.status(404).json({ error: "Curso no encontrado" });

    res.json({ message: "Curso eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener cursos de un profesor
router.get("/teacher/:teacher_id", verifyToken, async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { teacher_id: req.params.teacher_id },
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener cursos en los que está inscrito un estudiante
router.get("/student/:student_id", verifyToken, async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: {
        id: {
          [Op.in]: sequelize.literal(
            `(SELECT course_id FROM enrollments WHERE student_id = '${req.params.student_id}')`
          ),
        },
      },
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inscribir a un estudiante en un curso
router.post("/:id/enroll", verifyToken, async (req, res) => {
  try {
    const { student_id } = req.body;

    await sequelize.query(
      `INSERT INTO enrollments (course_id, student_id) VALUES ('${req.params.id}', '${student_id}')`
    );

    res.status(201).json({ message: "Estudiante inscrito correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retirar a un estudiante de un curso
router.delete("/:id/enroll", verifyToken, async (req, res) => {
  try {
    const { student_id } = req.body;

    await sequelize.query(
      `DELETE FROM enrollments WHERE course_id = '${req.params.id}' AND student_id = '${student_id}'`
    );

    res.json({ message: "Estudiante retirado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
