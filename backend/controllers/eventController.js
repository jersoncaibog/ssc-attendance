const Event = require('../models/Event');

const eventController = {
  async getAllEvents(req, res) {
    try {
      const events = await Event.findAll();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
  },

  async getEventById(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching event', error: error.message });
    }
  },

  async createEvent(req, res) {
    try {
      const event = await Event.create(req.body);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: 'Error creating event', error: error.message });
    }
  },

  async updateEvent(req, res) {
    try {
      const event = await Event.update(req.params.id, req.body);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: 'Error updating event', error: error.message });
    }
  },

  async deleteEvent(req, res) {
    try {
      const event = await Event.delete(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
  },

  async getEventsByDate(req, res) {
    try {
      const events = await Event.findByDate(req.params.date);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching events by date', error: error.message });
    }
  }
};

module.exports = eventController; 