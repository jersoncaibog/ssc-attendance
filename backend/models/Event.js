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
    
    // Create the event
    const eventQuery = `
      INSERT INTO events (title, description, event_date, location)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const eventResult = await db.query(eventQuery, [title, description, event_date, location]);
    const newEvent = eventResult.rows[0];

    // Get all students
    const studentsQuery = 'SELECT id, student_id FROM students';
    const studentsResult = await db.query(studentsQuery);
    const students = studentsResult.rows;

    // Create attendance records for all students
    if (students.length > 0) {
      const values = [];
      const params = [];
      let paramCount = 1;

      students.forEach(student => {
        values.push(`($${paramCount}, $${paramCount + 1}, $${paramCount + 2}, $${paramCount + 3})`);
        params.push(student.student_id, newEvent.id, 'Absent', new Date());
        paramCount += 4;
      });

      const attendanceQuery = `
        INSERT INTO attendance (student_id, event_id, status, check_in_time)
        VALUES ${values.join(', ')}
      `;
      await db.query(attendanceQuery, params);
    }

    return newEvent;
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