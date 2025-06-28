import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import { errorHandler } from './middleware/error.middleware';

// @load environment variables
dotenv.config();

const app = express();

// @middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

// @routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// @error handling
app.use(errorHandler);

// @start server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Accepting requests from: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
