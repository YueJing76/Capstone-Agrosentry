const axios = require("axios");
const FormData = require("form-data");

class MLService {
  constructor() {
    this.mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:5001";
  }

  async checkHealth() {
    try {
      const response = await axios.get(`${this.mlServiceUrl}/health`);
      return response.data;
    } catch (error) {
      throw new Error(`ML service health check failed: ${error.message}`);
    }
  }

  async predictDisease(imageBuffer, originalFilename) {
    try {
      const formData = new FormData();
      formData.append("image", imageBuffer, {
        filename: originalFilename,
        contentType: "image/jpeg",
      });

      const response = await axios.post(
        `${this.mlServiceUrl}/predict`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 30000, // 30 second timeout
        }
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          `ML prediction failed: ${error.response.data.error || error.message}`
        );
      }
      throw new Error(`ML service connection failed: ${error.message}`);
    }
  }
}

module.exports = new MLService();
