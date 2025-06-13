import BasePresenter from "./BasePresenter";
import DetectionService from "../services/DetectionService";

class DetectionPresenter extends BasePresenter {
  async handleImageUpload(imageFile) {
    this.setLoading(true);
    this.setError(null);

    try {
      if (!imageFile) {
        throw new Error("Please select an image file");
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(imageFile.type)) {
        throw new Error("Please select a valid image file (JPEG, PNG, GIF)");
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (imageFile.size > maxSize) {
        throw new Error("Image file size must be less than 10MB");
      }

      const response = await DetectionService.uploadImage(imageFile);

      if (response.success) {
        this.showSuccess("Image uploaded and analyzed successfully!");

        if (this.view && this.view.onUploadSuccess) {
          this.view.onUploadSuccess(response.data);
        }
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setLoading(false);
    }
  }

  async loadDetectionHistory(page = 1, limit = 10) {
    this.setLoading(true);
    this.setError(null);

    try {
      const response = await DetectionService.getDetectionHistory(page, limit);

      if (response.success) {
        if (this.view && this.view.setDetections) {
          this.view.setDetections(response.data.detections);
        }
      } else {
        throw new Error(response.message || "Failed to load history");
      }
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setLoading(false);
    }
  }

  async loadDetectionById(id) {
    this.setLoading(true);
    this.setError(null);

    try {
      const response = await DetectionService.getDetectionById(id);

      if (response.success) {
        if (this.view && this.view.setDetection) {
          this.view.setDetection(response.data);
        }
      } else {
        throw new Error(response.message || "Detection not found");
      }
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setLoading(false);
    }
  }

  async loadDetectionStats() {
    this.setLoading(true);
    this.setError(null);

    try {
      const response = await DetectionService.getDetectionStats();

      if (response.success) {
        if (this.view && this.view.setStats) {
          this.view.setStats(response.data);
        }
      } else {
        throw new Error(response.message || "Failed to load statistics");
      }
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setLoading(false);
    }
  }

  async checkMLServiceHealth() {
    this.setLoading(true);
    this.setError(null);

    try {
      const response = await DetectionService.checkMLHealth();

      if (response.success) {
        if (this.view && this.view.setMLHealth) {
          this.view.setMLHealth(response.data);
        }
      } else {
        throw new Error(response.message || "ML service health check failed");
      }
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setLoading(false);
    }
  }
}

export default new DetectionPresenter();
