class DetectionModel {
  constructor() {
    this.detections = [];
    this.currentDetection = null;
    this.stats = null;
    this.mlHealth = null;
  }

  setDetections(detections) {
    this.detections = detections;
  }

  getDetections() {
    return this.detections;
  }

  addDetection(detection) {
    this.detections.unshift(detection);
  }

  setCurrentDetection(detection) {
    this.currentDetection = detection;
  }

  getCurrentDetection() {
    return this.currentDetection;
  }

  setStats(stats) {
    this.stats = stats;
  }

  getStats() {
    return this.stats;
  }

  setMLHealth(health) {
    this.mlHealth = health;
  }

  getMLHealth() {
    return this.mlHealth;
  }

  clearDetections() {
    this.detections = [];
    this.currentDetection = null;
    this.stats = null;
  }

  findDetectionById(id) {
    return this.detections.find((detection) => detection.id === parseInt(id));
  }

  updateDetection(updatedDetection) {
    const index = this.detections.findIndex(
      (d) => d.id === updatedDetection.id
    );
    if (index !== -1) {
      this.detections[index] = updatedDetection;
    }
  }
}

export default new DetectionModel();
