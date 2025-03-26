import express from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import cloudinary from "../config/cloudinary.js";
import { verifyToken, generateToken } from "../config/jwt.js";

dotenv.config();
const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "tu_secreto_super_seguro";

let sessions = {};

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
      if (!grade) return res.status(400).json({ error: "Datos de estudiante incompletos" });

      await Student.create({
        id: newUser.id,
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
    if (!user) return res.status(400).json({ error: "Wrong credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Wrong credentials" });

    //Verifica si ya hay una sesión
    if (sessions[user.id]) {
      return res.status(400).json({ error: "Ya hay una sesión"});
    }

    const token = generateToken(user);

    sessions[user.id] = token;

    res.json({ message: "Sign in succesfully", token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/get-signature", verifyToken, (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const params = { timestamp, folder: "tareas" };

  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);

  res.json({ timestamp, signature, cloudName: process.env.CLOUDINARY_CLOUD_NAME });
});

router.post("/logout", verifyToken, (req, res) => {
  const userId = req.user.id;  // Obtenemos el ID del usuario desde el token

  // Eliminamos la sesión del objeto sessions
  if (sessions[userId]) {
    delete sessions[userId];
    return res.status(200).json({ message: "Sesión cerrada exitosamente" });
  }

  return res.status(400).json({ error: "No se encontró sesión activa para cerrar" });
});

export default router;
