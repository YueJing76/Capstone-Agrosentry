const db = require("../config/database");
const { parse } = require('path');
const fs = require("fs"); // Pastikan ini diimpor jika digunakan di models

class Detection {
  static async create(detectionData) {
    const query = `
      INSERT INTO plant_detections
      (user_id, image_path, original_filename, predicted_disease, confidence,
       severity_level, all_predictions, disease_info, recommendations)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, created_at;
    `;

    const values = [
      detectionData.user_id,
      detectionData.image_path,
      detectionData.original_filename,
      detectionData.predicted_disease,
      detectionData.confidence,
      detectionData.severity_level,
      JSON.stringify(detectionData.all_predictions), // stringify untuk JSONB
      JSON.stringify(detectionData.disease_info),    // stringify untuk JSONB
      JSON.stringify(detectionData.recommendations), // stringify untuk JSONB
    ];

    const { rows } = await db.query(query, values);
    return { ...rows[0], ...detectionData };
  }

  static async findByUserId(userId, limit = 20, offset = 0) {
    const query = `
      SELECT id, image_path, original_filename, predicted_disease,
             confidence, severity_level, all_predictions, disease_info,
             recommendations, created_at
      FROM plant_detections
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const { rows } = await db.query(query, [userId, limit, offset]);

    const detections = rows.map((detection) => ({
      ...detection,
      all_predictions: typeof detection.all_predictions === 'string' ? JSON.parse(detection.all_predictions) : detection.all_predictions,
      disease_info: typeof detection.disease_info === 'string' ? JSON.parse(detection.disease_info) : detection.disease_info,
      recommendations: typeof detection.recommendations === 'string' ? JSON.parse(detection.recommendations) : detection.recommendations,
    }));

    return detections;
  }

  static async findById(id) {
    const query = `
      SELECT * FROM plant_detections WHERE id = $1
    `;

    const { rows } = await db.query(query, [id]);

    if (rows.length === 0) {
      return null;
    } else {
      const detection = rows[0];
      return {
        ...detection,
        all_predictions: typeof detection.all_predictions === 'string' ? JSON.parse(detection.all_predictions) : detection.all_predictions,
        disease_info: typeof detection.disease_info === 'string' ? JSON.parse(detection.disease_info) : detection.disease_info,
        recommendations: typeof detection.recommendations === 'string' ? JSON.parse(detection.recommendations) : detection.recommendations,
      };
    }
  }

  static async getDetectionStats(userId) {
    const query = `
      SELECT
        COUNT(*) as total_detections,
        COUNT(DISTINCT predicted_disease) as unique_diseases,
        AVG(confidence) as avg_confidence,
        predicted_disease,
        COUNT(*) as disease_count
      FROM plant_detections
      WHERE user_id = $1
      GROUP BY predicted_disease
      ORDER BY disease_count DESC
    `;
    const { rows } = await db.query(query, [userId]);
    return rows;
  }
}

module.exports = Detection;