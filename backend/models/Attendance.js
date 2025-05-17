const db = require('../config/database');

class Attendance {
  static async findByEvent(eventId) {
    const query = `
      SELECT a.*, s.name, s.student_id, s.course, s.year, s.section, s.student_id
      FROM attendance a
      JOIN students s ON a.student_id = s.student_id
      WHERE a.event_id = $1
      ORDER BY s.name
    `;
    const result = await db.query(query, [eventId]);
    return result.rows;
  }

  static async findByStudent(studentId) {
    const query = `
      SELECT a.*, e.title, e.event_date, e.location
      FROM attendance a
      JOIN events e ON a.event_id = e.id
      WHERE a.student_id = $1
      ORDER BY e.event_date DESC
    `;
    const result = await db.query(query, [studentId]);
    return result.rows;
  }

  static async updateStatus(studentId, eventId, status) {
    const query = `
      UPDATE attendance 
      SET status = $1, check_in_time = CURRENT_TIMESTAMP
      WHERE student_id = $2 AND event_id = $3
      RETURNING *
    `;
    const result = await db.query(query, [status, studentId, eventId]);
    return result.rows[0];
  }

  static async createBulk(eventId, studentIds) {
    const values = studentIds.map(studentId => 
      `('${studentId}', ${eventId}, 'Absent', CURRENT_TIMESTAMP)`
    ).join(',');
    
    const query = `
      INSERT INTO attendance (student_id, event_id, status, check_in_time)
      VALUES ${values}
      ON CONFLICT (student_id, event_id) DO NOTHING
      RETURNING *
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async getAttendanceStats(eventId) {
    const query = `
      SELECT 
        status,
        COUNT(*) as count
      FROM attendance
      WHERE event_id = $1
      GROUP BY status
    `;
    const result = await db.query(query, [eventId]);
    return result.rows;
  }
}

module.exports = Attendance; 