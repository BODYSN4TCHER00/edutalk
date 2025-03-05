import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js'
import teacherRoutes from './routes/teacher.routes.js';
import messageRoutes from './routes/message.routes.js';
import conversationRoutes from './routes/conversation.routes.js'
import sequelize from './config/db.js';
import "./models/User.js";
import "./models/Conversation.js";
import "./models/Message.js";
import "./models/Student.js";
import "./models/Teacher.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req,res, next) => {
  req.io = io;
  next();
});

//Routes
app.use('/api/user/', userRoutes);
app.use('/api/auth/', authRoutes);
app.use('/api/teacher/', teacherRoutes);
app.use('/api/message/', messageRoutes);
app.use('/api/conversation/', conversationRoutes);

io.on("connection", (socket) => {
  console.log("Client connected: ", socket.io);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

const startServer = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Connected to db");

    server.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (error) {
    console.error("Error running server:", error);
  }
};

startServer();