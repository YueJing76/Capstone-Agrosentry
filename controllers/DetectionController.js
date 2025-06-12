// controllers/DetectionController.js
const Detection = require("../models/Detection");
const MLService = require("../services/MLService");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    mimetype && extname
      ? cb(null, true)
      : cb(new Error("Only image files are allowed"));
  },
});

class DetectionController {
  static async detectDisease(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No image file uploaded" });
      }

      const { userId } = req.user;
      const imagePath = req.file.path;
      const originalFilename = req.file.originalname;

      console.log("📁 Processing file:", originalFilename);
      console.log("👤 User ID:", userId);

      // Read image and get prediction
      const imageBuffer = fs.readFileSync(imagePath);
      const predictionResult = await MLService.predictDisease(
        imageBuffer,
        originalFilename
      );

      console.log("🤖 ML Service Result:", predictionResult);

      // ✅ PERBAIKAN: Gunakan DetectionController.processPrediction() bukan this.processPrediction()
      const { prediction, error } =
        DetectionController.processPrediction(predictionResult);

      console.log("📊 Processed Prediction:", prediction);

      // Prepare detection data
      const detectionData = {
        user_id: userId,
        image_path: imagePath,
        original_filename: originalFilename,
        predicted_disease: prediction.top_class,
        confidence: prediction.top_confidence,
        severity_level: DetectionController.getSeverityLevel(
          prediction.top_confidence
        ),
        all_predictions: prediction.all_predictions,
        disease_info: DetectionController.getDiseaseInfo(prediction.top_class),
        recommendations: DetectionController.getRecommendations(
          prediction.top_class
        ),
      };

      console.log("💾 Saving detection data:", detectionData);

      // Save to database
      const savedDetection = await Detection.create(detectionData);

      console.log("✅ Detection saved with ID:", savedDetection.id);

      // Prepare response
      const responseData = {
        detection_id: savedDetection.id,
        prediction: {
          disease_name: detectionData.predicted_disease,
          confidence: detectionData.confidence,
          severity_level: detectionData.severity_level,
          all_predictions: detectionData.all_predictions,
        },
        disease_info: detectionData.disease_info,
        recommendations: detectionData.recommendations,
        image_url: `/uploads/${path.basename(imagePath)}`,
      };

      if (error) responseData.note = error;

      res.status(200).json({
        success: true,
        message: error
          ? "Detection completed with warnings"
          : "Detection successful",
        data: responseData,
      });
    } catch (error) {
      console.error("❌ Detection error:", error);

      // Clean up uploaded file if error occurs
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
        console.log("🗑️ Cleaned up uploaded file");
      }

      res.status(500).json({
        success: false,
        message: "Disease detection failed",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  }

  static async getDetectionHistory(req, res) {
    try {
      const { userId } = req.user;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      const detections = await Detection.findByUserId(userId, limit, offset);

      const detectionsWithUrls = detections.map((detection) => ({
        ...detection,
        image_url: `/uploads/${path.basename(detection.image_path)}`,
      }));

      res.status(200).json({
        success: true,
        message: "Detection history retrieved successfully",
        data: {
          detections: detectionsWithUrls,
          pagination: {
            current_page: page,
            per_page: limit,
            total_items: detections.length,
          },
        },
      });
    } catch (error) {
      console.error("Get history error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve detection history",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  static async getDetectionById(req, res) {
    try {
      const detectionId = req.params.id;
      const { userId } = req.user;

      const detection = await Detection.findById(detectionId);

      if (!detection) {
        return res.status(404).json({
          success: false,
          message: "Detection not found",
        });
      }

      if (detection.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      detection.image_url = `/uploads/${path.basename(detection.image_path)}`;

      res.status(200).json({
        success: true,
        message: "Detection details retrieved successfully",
        data: detection,
      });
    } catch (error) {
      console.error("Get detection error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve detection details",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  static async getDetectionStats(req, res) {
    try {
      const { userId } = req.user;
      const stats = await Detection.getDetectionStats(userId);

      const totalDetections = stats.reduce(
        (sum, stat) => sum + stat.disease_count,
        0
      );
      const uniqueDiseases = stats.length;
      const avgConfidence =
        stats.length > 0
          ? stats.reduce(
              (sum, stat) => sum + parseFloat(stat.avg_confidence),
              0
            ) / stats.length
          : 0;

      res.status(200).json({
        success: true,
        message: "Detection statistics retrieved successfully",
        data: {
          total_detections: totalDetections,
          unique_diseases: uniqueDiseases,
          average_confidence: parseFloat(avgConfidence.toFixed(4)),
          disease_breakdown: stats.map((stat) => ({
            disease_name: stat.predicted_disease,
            count: stat.disease_count,
            percentage:
              totalDetections > 0
                ? ((stat.disease_count / totalDetections) * 100).toFixed(2)
                : 0,
          })),
        },
      });
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve detection statistics",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  static async checkMLServiceHealth(req, res) {
    try {
      const healthStatus = await MLService.checkHealth();
      res.status(200).json({
        success: true,
        message: "ML service health check completed",
        data: healthStatus,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "ML service health check failed",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // ✅ PERBAIKAN: Semua helper methods harus static dan dipanggil dengan DetectionController.methodName()
  static processPrediction(predictionResult) {
    console.log("🔄 Processing prediction result:", predictionResult);

    const defaultPrediction = {
      top_class: "Unknown",
      top_confidence: 0.0,
      all_predictions: [],
    };

    if (!predictionResult?.success) {
      console.log("⚠️ ML service failed or unavailable");
      return {
        prediction: defaultPrediction,
        error: "ML service unavailable, using fallback data",
      };
    }

    const predictions = predictionResult.prediction?.all_predictions || [];
    console.log("📋 Raw predictions:", predictions);

    const validPredictions = predictions.filter(
      (p) => p.confidence && typeof p.confidence === "number" && p.class_name
    );

    if (validPredictions.length === 0) {
      console.log("⚠️ No valid predictions found");
      return {
        prediction: defaultPrediction,
        error: "No valid predictions received",
      };
    }

    const sortedPredictions = [...validPredictions].sort(
      (a, b) => b.confidence - a.confidence
    );

    console.log("📊 Sorted predictions:", sortedPredictions);

    return {
      prediction: {
        top_class: sortedPredictions[0].class_name,
        top_confidence: sortedPredictions[0].confidence,
        all_predictions: sortedPredictions,
      },
    };
  }

  static getSeverityLevel(confidence) {
    if (confidence >= 0.8) return "High Confidence";
    if (confidence >= 0.6) return "Medium Confidence";
    if (confidence >= 0.4) return "Low Confidence";
    return "Very Low Confidence";
  }

  static getDiseaseInfo(diseaseName) {
    const diseaseDatabase = {
      beetle: {
        name: "Beetle Infestation",
        description: "Serangan kumbang yang merusak tanaman",
        symptoms: ["Lubang pada daun", "Kerusakan batang", "Tanaman layu"],
        causes: "Kumbang pemakan daun",
        severity: "Sedang",
      },
      bees: {
        name: "Bee Activity",
        description: "Aktivitas lebah penyerbuk",
        symptoms: ["Lebah terlihat di sekitar bunga"],
        causes: "Proses penyerbukan alami",
        severity: "Menguntungkan",
      },
      grasshopper: {
        name: "Grasshopper Damage",
        description: "Kerusakan akibat belalang",
        symptoms: ["Daun terpotong tidak beraturan"],
        causes: "Serangan belalang",
        severity: "Sedang",
      },
    };

    return (
      diseaseDatabase[diseaseName.toLowerCase()] || {
        name: diseaseName,
        description: "Informasi deteksi belum tersedia",
        symptoms: ["Gejala tidak diketahui"],
        causes: "Penyebab belum teridentifikasi",
        severity: "Tidak diketahui",
      }
    );
  }

  static getRecommendations(diseaseName) {
    const recommendationDatabase = {
      beetle: {
        prevention: ["Rotasi tanaman", "Pembersihan lahan"],
        treatment: ["Insektisida organik", "Perangkap feromon"],
        organic_solutions: ["Neem oil", "Bacillus thuringiensis"],
      },
      bees: {
        prevention: ["Pertahankan habitat lebah"],
        treatment: ["Tidak diperlukan treatment"],
        organic_solutions: ["Tanam bunga penarik lebah"],
      },
      grasshopper: {
        prevention: ["Pemasangan kelambu", "Pengolahan tanah"],
        treatment: ["Insektisida selektif"],
        organic_solutions: ["Semprotan bawang putih"],
      },
    };

    const defaultRecommendations = {
      prevention: ["Konsultasi dengan ahli pertanian"],
      treatment: ["Pemeriksaan manual diperlukan"],
      organic_solutions: ["Penggunaan pestisida organik umum"],
    };

    return (
      recommendationDatabase[diseaseName.toLowerCase()] ||
      defaultRecommendations
    );
  }
}

// Export controller with upload middleware
DetectionController.upload = upload.single("image");
module.exports = DetectionController;
