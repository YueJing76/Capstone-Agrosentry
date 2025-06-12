const db = require("../config/database");
const bcrypt = require("bcrypt");

class User {
  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE email = ?";
      db.query(query, [email], (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null);
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT id, name, email, created_at FROM users WHERE id = ?";
      db.query(query, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null);
      });
    });
  }

  static async create({ name, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 12);
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
      db.query(query, [name, email, hashedPassword], (err, result) => {
        if (err) return reject(err);
        resolve({ id: result.insertId, name, email });
      });
    });
  }

  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;
