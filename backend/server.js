import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { initSocket } from './socket/index.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import craftRoutes from './routes/craftRoutes.js';
import workshopRoutes from './routes/workshopRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import mapRoutes from './routes/mapRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import { seedChatbot } from './seeders/chatbotSeeder.js';

connectDB().then(() => seedChatbot());

const app = express();
const httpServer = createServer(app);
initSocket(httpServer);

// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cors({
  origin: ['https://cuddly-journey-7vrj4x55pr4whw5qr-5173.app.github.dev', 'https://cuddly-journey-7vrj4x55pr4whw5qr-5000.app.github.dev'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/crafts', craftRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/blogs', blogRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
