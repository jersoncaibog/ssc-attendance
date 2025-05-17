const db = require('../config/database');

class Event {
  static async findAll() {
    const query = 'SELECT * FROM events ORDER BY event_date DESC';
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM events WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async create(eventData) {
    const { title, description, event_date, location } = eventData;
    const query = `
      INSERT INTO events (title, description, event_date, location)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await db.query(query, [title, description, event_date, location]);
    return result.rows[0];
  }

  static async update(id, eventData) {
    const { title, description, event_date, location } = eventData;
    const query = `
      UPDATE events 
      SET title = $1, description = $2, event_date = $3, location = $4
      WHERE id = $5
      RETURNING *
    `;
    const result = await db.query(query, [title, description, event_date, location, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM events WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByDate(date) {
    const query = 'SELECT * FROM events WHERE event_date = $1 ORDER BY id';
    const result = await db.query(query, [date]);
    return result.rows;
  }
}

module.exports = Event; 