import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "tu_secreto_super_seguro";

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, type: user.type },
    SECRET_KEY,
    { expiresIn: "7d" }
  );
};

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Acceso denegado. No hay token" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};
