const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Get all events
router.get('/', eventController.getAllEvents);

// Get events by date
router.get('/date/:date', eventController.getEventsByDate);

// Get single event
router.get('/:id', eventController.getEventById);

// Create event
router.post('/', eventController.createEvent);

// Update event
router.put('/:id', eventController.updateEvent);

// Delete event
router.delete('/:id', eventController.deleteEvent);

module.exports = router; 