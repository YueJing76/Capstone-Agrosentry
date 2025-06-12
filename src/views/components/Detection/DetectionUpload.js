// src/views/components/Detection/DetectionUpload.js
import React, { useState, useRef } from "react";
import {
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  ProgressBar,
  Image,
  Badge,
} from "react-bootstrap";
import DetectionService from "../../../services/DetectionService";

const DetectionUpload = ({
  onUploadStart,
  onUploadSuccess,
  onUploadError,
  isAnalyzing,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [analysisStage, setAnalysisStage] = useState("");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const analysisStages = [
    "Uploading image...",
    "Preprocessing image...",
    "Running AI analysis...",
    "Processing results...",
    "Finalizing...",
  ];

  const handleFileSelect = (file) => {
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Please select a valid image file (JPEG, PNG, GIF)");
        return;
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("Image file size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
      setError("");

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAnalyzing) setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (!isAnalyzing) {
      const files = [...e.dataTransfer.files];
      if (files && files[0]) {
        handleFileSelect(files[0]);
      }
    }
  };

  const simulateProgress = () => {
    setProgress(0);
    setAnalysisStage(analysisStages[0]);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;

        // Update stage based on progress
        if (newProgress > 80) {
          setAnalysisStage(analysisStages[4]);
        } else if (newProgress > 60) {
          setAnalysisStage(analysisStages[3]);
        } else if (newProgress > 40) {
          setAnalysisStage(analysisStages[2]);
        } else if (newProgress > 20) {
          setAnalysisStage(analysisStages[1]);
        }

        if (newProgress >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return newProgress;
      });
    }, 500);

    return progressInterval;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select an image file");
      return;
    }

    if (onUploadStart) onUploadStart();

    setError("");

    // Start progress simulation
    const progressInterval = simulateProgress();

    try {
      console.log("🔄 Starting analysis:", selectedFile.name);

      const response = await DetectionService.uploadImage(selectedFile);

      clearInterval(progressInterval);
      setProgress(100);
      setAnalysisStage("Complete!");

      if (response.success) {
        console.log("✅ Analysis successful:", response.data);

        if (onUploadSuccess) {
          onUploadSuccess(response.data);
        }

        // Reset form after success
        setTimeout(() => {
          setProgress(0);
          setAnalysisStage("");
        }, 2000);
      } else {
        throw new Error(response.error || "Analysis failed");
      }
    } catch (err) {
      console.error("❌ Analysis error:", err);
      clearInterval(progressInterval);
      setProgress(0);
      setAnalysisStage("");
      setError(err.message || "Failed to analyze image");

      if (onUploadError) {
        onUploadError(err);
      }
    }
  };

  const clearSelection = () => {
    if (!isAnalyzing) {
      setSelectedFile(null);
      setPreviewUrl("");
      setError("");
      setProgress(0);
      setAnalysisStage("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Card className="h-100">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">🌱 Plant Disease Detection</h5>
          {isAnalyzing && <Badge bg="warning">Analyzing...</Badge>}
        </div>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            <Alert.Heading>❌ Error</Alert.Heading>
            <p>{error}</p>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-3 p-4 text-center mb-3 ${
              dragActive ? "border-primary bg-light" : "border-secondary"
            } ${isAnalyzing ? "opacity-50" : ""}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
              minHeight: "200px",
              cursor: isAnalyzing ? "not-allowed" : "pointer",
            }}
            onClick={() => !isAnalyzing && fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <div>
                <Image
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxHeight: "150px", maxWidth: "100%" }}
                  className="mb-2"
                />
                <p className="text-muted mb-0">{selectedFile?.name}</p>
                <small className="text-muted">
                  Size: {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                </small>
                {isAnalyzing && (
                  <div className="mt-2">
                    <Badge bg="info">🔬 Analyzing...</Badge>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-3">
                  <i
                    className={`fas fa-cloud-upload-alt fa-3x ${isAnalyzing ? "text-muted" : "text-primary"}`}
                  ></i>
                </div>
                <h6>
                  {isAnalyzing
                    ? "Analysis in progress..."
                    : "Drag & drop your plant image here"}
                </h6>
                <p className="text-muted mb-2">
                  {isAnalyzing
                    ? "Please wait for current analysis to complete"
                    : "or click to browse files"}
                </p>
                <small className="text-muted">
                  Supported formats: JPEG, PNG, GIF (Max: 10MB)
                </small>
              </div>
            )}
          </div>

          <Form.Control
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            disabled={isAnalyzing}
          />

          {selectedFile && (
            <div className="d-flex gap-2 mb-3">
              <Button
                variant="outline-secondary"
                onClick={clearSelection}
                disabled={isAnalyzing}
              >
                Clear
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isAnalyzing || !selectedFile}
                className="flex-grow-1"
              >
                {isAnalyzing ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Analyzing...
                  </>
                ) : (
                  "🔍 Analyze Plant"
                )}
              </Button>
            </div>
          )}

          {/* Progress Bar */}
          {isAnalyzing && (
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-2">
                <small className="text-muted">{analysisStage}</small>
                <small className="text-muted">{Math.round(progress)}%</small>
              </div>
              <ProgressBar
                now={progress}
                animated
                variant={progress === 100 ? "success" : "primary"}
                style={{ height: "8px" }}
              />
            </div>
          )}
        </Form>

        <div className="mt-3">
          <h6>📋 Instructions:</h6>
          <ul className="small text-muted mb-0">
            <li>Upload a clear image of plant leaves or affected areas</li>
            <li>Ensure good lighting for better detection accuracy</li>
            <li>Results will appear automatically after analysis</li>
            <li>Supported formats: JPEG, PNG, GIF (Max: 10MB)</li>
          </ul>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DetectionUpload;
