const db = require('../config/database');

class User {
  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await db.query(query, [username]);
    return result.rows[0];
  }

  static async create(username, password, role) {
    const query = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *';
    const result = await db.query(query, [username, password, role]);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT id, username, role, last_login, created_at FROM users';
    const result = await db.query(query);
    return result.rows;
  }

  static async updateLastLogin(id) {
    const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = User; 