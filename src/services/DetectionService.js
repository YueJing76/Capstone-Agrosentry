// src/services/DetectionService.js
import DetectionModel from "../models/DetectionModel";

class DetectionService {
  constructor() {
    this.baseURL =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api";
  }

  async uploadImage(imageFile) {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      console.log("🔄 Uploading image:", imageFile.name);

      const response = await fetch(`${this.baseURL}/detection/detect`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Upload response:", result);

      if (result.success) {
        DetectionModel.addDetection(result.data);
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      return { success: false, error: error.message };
    }
  }

  async getDetectionHistory(page = 1, limit = 10) {
    try {
      console.log("🔄 Fetching detection history...");

      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${this.baseURL}/detection/history?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ History response:", result);

      if (result.success) {
        DetectionModel.setDetections(result.data.detections || []);
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || "Failed to get history");
      }
    } catch (error) {
      console.error("❌ History error:", error);
      return { success: false, error: error.message };
    }
  }

  async getDetectionById(id) {
    try {
      console.log("🔄 Fetching detection by ID:", id);

      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${this.baseURL}/detection/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Detection detail response:", result);

      if (result.success) {
        DetectionModel.setCurrentDetection(result.data);
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || "Detection not found");
      }
    } catch (error) {
      console.error("❌ Detection detail error:", error);
      return { success: false, error: error.message };
    }
  }

  async getDetectionStats() {
    try {
      console.log("🔄 Fetching detection stats...");

      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${this.baseURL}/detection/stats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Stats response:", result);

      if (result.success) {
        DetectionModel.setStats(result.data);
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || "Failed to get stats");
      }
    } catch (error) {
      console.error("❌ Stats error:", error);
      return { success: false, error: error.message };
    }
  }

  async checkMLHealth() {
    try {
      console.log("🔄 Checking ML service health...");

      const token =
        localStorage.getItem("authToken") || localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${this.baseURL}/detection/ml-health`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ ML Health response:", result);

      if (result.success) {
        DetectionModel.setMLHealth(result.data);
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || "ML health check failed");
      }
    } catch (error) {
      console.error("❌ ML Health error:", error);
      return { success: false, error: error.message };
    }
  }
}

export default new DetectionService();
