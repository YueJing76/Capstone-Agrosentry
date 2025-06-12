const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const authenticateToken = require("../middleware/auth");

// Test route - pastikan path sederhana
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth routes working!",
  });
});

// Public routes - pastikan path bersih tanpa karakter khusus
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Protected routes
router.get("/profile", authenticateToken, AuthController.getProfile);

module.exports = router;
