const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { setupRealtimeNotifications } = require('./config/database');

// Import routes
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const eventRoutes = require('./routes/eventRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const httpServer = createServer(app);

// Setup Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Setup real-time notifications
setupRealtimeNotifications(io);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/attendance', attendanceRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SSC Attendance API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 