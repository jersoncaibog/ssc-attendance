const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const { Server } = require('socket.io');

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('config/ca.pem').toString()
  }
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Successfully connected to database');
  release();
});

// Function to setup real-time notifications
const setupRealtimeNotifications = async (io) => {
  try {
    // Get a client from the existing pool
    const client = await pool.connect();
    
    // Listen for attendance changes
    await client.query('LISTEN attendance_changes');

    client.on('notification', (msg) => {
      try {
        const payload = JSON.parse(msg.payload);
        io.emit('attendanceUpdate', payload);
      } catch (error) {
        console.error('Error processing notification:', error);
      }
    });

    // Handle client errors
    client.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });

    console.log('Successfully set up real-time notifications');
  } catch (error) {
    console.error('Error setting up real-time notifications:', error);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  setupRealtimeNotifications
}; 