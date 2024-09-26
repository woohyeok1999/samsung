const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create(id, name, email, password, department = null, phone = null, isAdmin = 0) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (id, name, email, password, department, phone, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, email, hashedPassword, department, phone, isAdmin]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);  // 사번으로 사용자 찾기
    return rows[0];
  }

  static async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }

  static async isAdmin(userId) {
    const [rows] = await db.execute('SELECT isAdmin FROM users WHERE id = ?', [userId]);
    return rows[0] ? rows[0].isAdmin === 1 : false;
  }

  static async updateName(userId, name) {
    await db.execute('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
  }
}

module.exports = User;