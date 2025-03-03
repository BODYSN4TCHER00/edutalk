import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";

dotenv.config();
const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "tu_secreto_super_seguro";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, type: user.type },
    SECRET_KEY,
    { expiresIn: "7d" }
  );
};

router.post("/register", async (req, res) => {
  try {
    const { username, name, lastname, email, password, type, enrollment, grade, employee_id, department } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "El usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      name,
      lastname,
      email,
      password: hashedPassword,
      type,
    });

    if (type === "student") {
      if (!enrollment || !grade) return res.status(400).json({ error: "Datos de estudiante incompletos" });

      await Student.create({
        id: newUser.id,
        enrollment,
        grade,
      });

    } else if (type === "teacher") {
      if (!employee_id || !department) return res.status(400).json({ error: "Datos de maestro incompletos" });

      await Teacher.create({
        id: newUser.id,
        employee_id,
        department,
      });

    } else {
      return res.status(400).json({ error: "Tipo de usuario inválido" });
    }

    const token = generateToken(newUser);

    res.status(201).json({ message: "Usuario registrado correctamente", token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: "Credenciales incorrectas" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Credenciales incorrectas" });

    const token = generateToken(user);

    res.json({ message: "Inicio de sesión exitoso", token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
