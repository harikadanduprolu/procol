import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

// Import routes
import authRoutes from './routes/auth';
import projectRoutes from './routes/project';
import teamRoutes from './routes/team';
import fundingRoutes from './routes/funding';
import messageRoutes from './routes/message';
import notificationRoutes from './routes/notification';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Define allowed origins
const allowedOrigins = ([
  process.env.FRONTEND_URL,
  process.env.SOCKET_CORS_ORIGIN,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080'
].filter(Boolean) as string[]);


const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Export io instance
export { io };

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = Number(process.env.PORT) || 5000;

// Function to start the server with a specific port
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/projecthub', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room for private messaging
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle new messages
  socket.on('message', (data) => {
    io.to(data.recipient).emit('newMessage', data);
  });

  // Handle notifications
  socket.on('notification', (data) => {
    io.to(data.recipient).emit('newNotification', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/funding', fundingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

