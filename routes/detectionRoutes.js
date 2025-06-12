// routes/detectionRoutes.js
const express = require("express");
const router = express.Router();
const DetectionController = require("../controllers/DetectionController");
const authenticateToken = require("../middleware/auth");

router.get(
  "/ml-health",
  authenticateToken,
  DetectionController.checkMLServiceHealth
);
router.post(
  "/detect",
  authenticateToken,
  DetectionController.upload,
  DetectionController.detectDisease
);
router.get(
  "/history",
  authenticateToken,
  DetectionController.getDetectionHistory
);
router.get("/stats", authenticateToken, DetectionController.getDetectionStats);
router.get("/:id", authenticateToken, DetectionController.getDetectionById);

module.exports = router;
