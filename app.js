import express from 'express';
import routes from './routes/user.routes.js';
import sequelize from './config/db.js';
import "./models/User.js";
import "./models/Conversation.js";
import "./models/Message.js";
import "./models/Student.js";
import "./models/Teacher.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/user', routes);

sequelize
  .sync({ force: true }) // Esto eliminará y volverá a crear las tablas en cada reinicio
  .then(() => {
    console.log("Connected to db");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((error) => console.error("Error al conectar con la base de datos:", error));