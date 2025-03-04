import express from 'express';
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
import { connectRabbitMQ } from './config/rabbitmq.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//Routes
app.use(express.json());
app.use('/api/user/', userRoutes);
app.use('/api/auth/', authRoutes);
app.use('/api/teacher/', teacherRoutes);
app.use('/api/message/', messageRoutes);
app.use('/api/conversation/', conversationRoutes);

const startServer = async () => {
  try {
    await sequelize.sync({alter: true});
    console.log("Connected to db");
    
    await connectRabbitMQ("Connected to rabbitmq");
    console.log();
    
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (error) {
    console.error("Error running server:", error);
  }
};

startServer();