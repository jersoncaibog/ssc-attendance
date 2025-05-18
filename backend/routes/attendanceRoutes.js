const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Get attendance for an event
router.get('/event/:eventId', attendanceController.getEventAttendance);

// Get attendance for a student
router.get('/student/:studentId', attendanceController.getStudentAttendance);

// Update attendance status
router.put('/:studentId/:eventId', attendanceController.updateAttendanceStatus);

// Update attendance using RFID
router.put('/rfid/:rfid/:eventId', attendanceController.updateAttendanceByRfid);

// Initialize attendance for an event
router.post('/event/:eventId/initialize', attendanceController.initializeEventAttendance);

// Get attendance statistics
router.get('/event/:eventId/stats', attendanceController.getAttendanceStats);

module.exports = router; 