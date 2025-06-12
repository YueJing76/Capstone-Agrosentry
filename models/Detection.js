const db = require("../config/database");

class Detection {
  static async create(detectionData) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO plant_detections 
        (user_id, image_path, original_filename, predicted_disease, confidence, 
         severity_level, all_predictions, disease_info, recommendations) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        detectionData.user_id,
        detectionData.image_path,
        detectionData.original_filename,
        detectionData.predicted_disease,
        detectionData.confidence,
        detectionData.severity_level,
        JSON.stringify(detectionData.all_predictions),
        JSON.stringify(detectionData.disease_info),
        JSON.stringify(detectionData.recommendations),
      ];

      db.query(query, values, (err, result) => {
        if (err) return reject(err);
        resolve({ id: result.insertId, ...detectionData });
      });
    });
  }

  static async findByUserId(userId, limit = 20, offset = 0) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT id, image_path, original_filename, predicted_disease, 
               confidence, severity_level, all_predictions, disease_info, 
               recommendations, created_at 
        FROM plant_detections 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `;

      db.query(query, [userId, limit, offset], (err, results) => {
        if (err) return reject(err);

        const detections = results.map((detection) => ({
          ...detection,
          all_predictions: detection.all_predictions,
          disease_info: detection.disease_info,
          recommendations: detection.recommendations,
        }));

        resolve(detections);
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM plant_detections WHERE id = ?
      `;

      db.query(query, [id], (err, results) => {
        if (err) return reject(err);

        if (results.length === 0) {
          resolve(null);
        } else {
          const detection = results[0];
          resolve({
            ...detection,
            all_predictions: detection.all_predictions,
            disease_info: detection.disease_info,
            recommendations: detection.recommendations,
          });
        }
      });
    });
  }

  static async getDetectionStats(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          COUNT(*) as total_detections,
          COUNT(DISTINCT predicted_disease) as unique_diseases,
          AVG(confidence) as avg_confidence,
          predicted_disease,
          COUNT(*) as disease_count
        FROM plant_detections 
        WHERE user_id = ? 
        GROUP BY predicted_disease
        ORDER BY disease_count DESC
      `;

      db.query(query, [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
}

module.exports = Detection;
