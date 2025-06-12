require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "http://localhost:8080",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ PERBAIKAN: Pastikan folder uploads ada
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created uploads directory");
}

// ✅ PERBAIKAN: Enhanced static file serving dengan proper headers
app.use(
  "/uploads",
  express.static(uploadsDir, {
    setHeaders: (res, filePath) => {
      // Set proper MIME types
      if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
        res.set("Content-Type", "image/jpeg");
      } else if (filePath.endsWith(".png")) {
        res.set("Content-Type", "image/png");
      } else if (filePath.endsWith(".gif")) {
        res.set("Content-Type", "image/gif");
      }

      // Set cache headers for better performance
      res.set("Cache-Control", "public, max-age=31557600"); // 1 year

      // Set CORS headers for images
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
    maxAge: "1d", // Cache for 1 day
  })
);

// ✅ PERBAIKAN: Debug middleware untuk static files
app.use("/uploads", (req, res, next) => {
  console.log(`📷 Static file request: ${req.url}`);
  next();
});

// Import database connection
require("./config/database");

// API Routes
const authRoutes = require("./routes/authRoutes");
const detectionRoutes = require("./routes/detectionRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/detection", detectionRoutes);

// ✅ PERBAIKAN: Test endpoint untuk uploads
app.get("/test-upload", (req, res) => {
  const uploadPath = path.join(__dirname, "uploads");
  fs.readdir(uploadPath, (err, files) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Cannot read uploads directory",
        error: err.message,
      });
    }

    res.json({
      success: true,
      message: "Uploads directory accessible",
      uploadPath: uploadPath,
      filesCount: files.length,
      files: files.slice(0, 5), // Show first 5 files
    });
  });
});

// Test endpoint
app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Server is working!",
    timestamp: new Date().toISOString(),
    uploadsPath: path.join(__dirname, "uploads"),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Plant Disease Detection API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      detection: "/api/detection",
      uploads: "/uploads",
      health: "/test",
      testUpload: "/test-upload",
    },
  });
});

// ✅ PERBAIKAN: Better error handling for static files
app.use("/uploads", (err, req, res, next) => {
  console.error("Static file error:", err);
  res.status(404).json({
    success: false,
    message: "Image not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan server!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route tidak ditemukan",
  });
});

app.listen(PORT, (err) => {
  if (err) {
    console.error("Gagal memulai server:", err);
    return;
  }
  console.log(`🚀 Server berjalan di port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 Test server: http://localhost:${PORT}/test`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`🌱 Detection API: http://localhost:${PORT}/api/detection`);
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);

  // ✅ PERBAIKAN: Verify uploads directory on startup
  const uploadsPath = path.join(__dirname, "uploads");
  console.log(`📂 Uploads directory: ${uploadsPath}`);
  console.log(`📂 Directory exists: ${fs.existsSync(uploadsPath)}`);
});
