const User = require("../models/User");
const jwt = require("jsonwebtoken");

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validasi input
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Semua field harus diisi",
        });
      }

      // Validasi format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Format email tidak valid",
        });
      }

      // Validasi password minimum 6 karakter
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password minimal 6 karakter",
        });
      }

      // Cek user existing
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email sudah terdaftar",
        });
      }

      // Create user
      const newUser = await User.create({ name, email, password });

      // Generate token
      const token = jwt.sign(
        { userId: newUser.id, email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.status(201).json({
        success: true,
        message: "User berhasil didaftarkan",
        data: {
          userId: newUser.id,
          name: newUser.name,
          email: newUser.email,
          token,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Error server internal",
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validasi input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email dan password harus diisi",
        });
      }

      // Cek user
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Kredensial tidak valid",
        });
      }

      // Cek password
      const isMatch = await User.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Kredensial tidak valid",
        });
      }

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.json({
        success: true,
        message: "Login berhasil",
        data: {
          userId: user.id,
          name: user.name,
          email: user.email,
          token,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Error server internal",
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      res.json({
        success: true,
        message: "Profile berhasil diambil",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.created_at,
        },
      });
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({
        success: false,
        message: "Error server internal",
      });
    }
  }
}

module.exports = AuthController;
