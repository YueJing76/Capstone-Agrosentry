const db = require("../config/database");
const bcrypt = require("bcrypt");

class User {
  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1"; // Perubahan placeholder
    const { rows } = await db.query(query, [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const query = "SELECT id, name, email, created_at FROM users WHERE id = $1"; // Perubahan placeholder
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  static async create({ name, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const query = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email"; // Perubahan placeholder dan RETURNING
    const { rows } = await db.query(query, [name, email, hashedPassword]);
    return rows[0];
  }

  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;