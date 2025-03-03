import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] }, // No devolver la contraseña
    });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, name, lastname, email, password, type } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "El usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      name,
      lastname,
      email,
      password: hashedPassword,
      type: type || "student",
    });

    res.status(201).json({ message: "Usuario creado con éxito", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const { username, name, lastname, email, password, type } = req.body;

    let updatedFields = { username, name, lastname, email, type };
    if (password) updatedFields.password = await bcrypt.hash(password, 10);

    await user.update(updatedFields, { fields: Object.keys(updatedFields) });

    res.json({ message: "Usuario actualizado con éxito", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
