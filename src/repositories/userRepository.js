const pool = require('../db');

class UserRepository {
  static async getAll() {
    const sql = 'SELECT * FROM user ORDER BY id DESC';
    const [rows] = await pool.query(sql);
    return rows;
  }

  static async getById(id) {
    const sql = 'SELECT * FROM user WHERE id = ?';
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  }

  static async getByEmail(email) {
    const sql = 'SELECT * FROM user WHERE correo = ?';
    const [rows] = await pool.query(sql, [email]);
    return rows[0] || null;
  }

  static async login(correo, password) {
    // Mirrors original C# behavior: join permisos to get NombreRol
    const sql = `SELECT u.*, p.rol as NombreRol FROM user u INNER JOIN permisos p ON u.rol = p.id WHERE u.correo = ? AND u.password = ?`;
    const [rows] = await pool.query(sql, [correo, password]);
    return rows[0] || null;
  }

  static async create(user) {
    const sql = `INSERT INTO user (nombre, correo, telefono, password, rol, fecha) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [user.nombre, user.correo, user.telefono, user.password, user.rol, user.fecha || new Date()];
    const [result] = await pool.query(sql, params);
    return result.insertId;
  }

  static async update(user) {
    const sql = `UPDATE user SET nombre = ?, correo = ?, telefono = ?, password = ?, rol = ? WHERE id = ?`;
    const params = [user.nombre, user.correo, user.telefono, user.password, user.rol, user.id];
    const [result] = await pool.query(sql, params);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const sql = `DELETE FROM user WHERE id = ?`;
    const [result] = await pool.query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = UserRepository;
