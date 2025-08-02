import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';

config();
const PORT = process.env.PORT || 3000;

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Importar rutas
import authRoutes from './routes/auth.routes.js';
import menuRoutes from './routes/menu.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import usersRoutes from './routes/users.routes.js';

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/users', usersRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Manejo de errores
import errorMiddleware from './middlewares/error.middleware.js';
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(` 🔥 Servidor corriendo en http://localhost:${PORT}`);
});

export default app;