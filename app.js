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

const app = express();
const PORT = 3000;

//Routes
app.use(express.json());
app.use('/api/user/', userRoutes);
app.use('/api/auth/', authRoutes);
app.use('/api/teacher/', teacherRoutes);
app.use('/api/message/', messageRoutes);
app.use('/api/conversation/', conversationRoutes);

sequelize
  .sync({ force: true }) // Esto eliminará y volverá a crear las tablas en cada reinicio
  .then(() => {
    console.log("Connected to db");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((error) => console.error("Error al conectar con la base de datos:", error));