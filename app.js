import express, { json } from 'express';
import routes from './routes/user.routes.js';

const app = express();
const PORT = 3000;

app.use(json());
app.use('/api/user', routes);

app.listen(
    PORT,
    () => console.log('Server running on port 3000')
);