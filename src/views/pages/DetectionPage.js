// src/views/pages/DetectionPage.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Alert,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DetectionUpload from "../components/Detection/DetectionUpload";
import DetectionResult from "../components/Detection/DetectionResult";
import MLHealthCheck from "../components/Detection/MLHealthCheck";

const DetectionPage = () => {
  const [detectionResult, setDetectionResult] = useState(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const navigate = useNavigate();

  const handleUploadStart = () => {
    setIsAnalyzing(true);
    setDetectionResult(null);
    setShowSuccessToast(false);
  };

  const handleUploadSuccess = (result) => {
    console.log("✅ Upload success:", result);
    setDetectionResult(result);
    setIsAnalyzing(false);

    // Auto switch ke results tab setelah 1 detik
    setTimeout(() => {
      setActiveTab("result");
      setShowSuccessToast(true);
    }, 1000);
  };

  const handleUploadError = (error) => {
    console.error("❌ Upload error:", error);
    setIsAnalyzing(false);
    setDetectionResult(null);
  };

  const handleViewDetails = (detectionId) => {
    navigate(`/detection/detail/${detectionId}`);
  };

  const handleNewAnalysis = () => {
    setActiveTab("upload");
    setDetectionResult(null);
    setShowSuccessToast(false);
  };

  return (
    <Container className="py-4">
      <div className="mb-4">
        <h2>🌱 Plant Disease Detection</h2>
        <p className="text-muted">
          Upload plant images to detect diseases and get treatment
          recommendations
        </p>
      </div>

      {/* Analysis Progress Alert */}
      {isAnalyzing && (
        <Alert variant="info" className="mb-4">
          <div className="d-flex align-items-center">
            <div
              className="spinner-border spinner-border-sm me-3"
              role="status"
            ></div>
            <div>
              <Alert.Heading className="h6 mb-1">
                🔍 Analyzing Your Plant Image...
              </Alert.Heading>
              <p className="mb-0">
                Please wait while our AI analyzes the image. This may take a few
                seconds.
              </p>
            </div>
          </div>
        </Alert>
      )}

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        <Tab
          eventKey="upload"
          title={
            <>
              📤 Upload & Analyze
              {isAnalyzing && (
                <span className="spinner-border spinner-border-sm ms-2"></span>
              )}
            </>
          }
        >
          <Row>
            <Col lg={8}>
              <DetectionUpload
                onUploadStart={handleUploadStart}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                isAnalyzing={isAnalyzing}
              />
            </Col>
            <Col lg={4}>
              <MLHealthCheck />
            </Col>
          </Row>
        </Tab>

        <Tab
          eventKey="result"
          title={
            <>
              📊 Results
              {detectionResult && (
                <span className="badge bg-success ms-2">Ready</span>
              )}
              {isAnalyzing && (
                <span className="badge bg-warning ms-2">Processing...</span>
              )}
            </>
          }
          disabled={!detectionResult && !isAnalyzing}
        >
          {isAnalyzing ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5>🔬 Analyzing Plant Image</h5>
              <p className="text-muted">
                Our AI is processing your image. Please wait...
              </p>
            </div>
          ) : detectionResult ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">🎯 Analysis Results</h5>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={handleNewAnalysis}
                >
                  📤 New Analysis
                </button>
              </div>
              <DetectionResult
                result={detectionResult}
                onViewDetails={handleViewDetails}
              />
            </>
          ) : (
            <Alert variant="info">
              <Alert.Heading>📋 No Results Yet</Alert.Heading>
              <p>
                Upload an image in the "Upload & Analyze" tab to see detection
                results here.
              </p>
            </Alert>
          )}
        </Tab>
      </Tabs>

      {/* Success Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showSuccessToast}
          onClose={() => setShowSuccessToast(false)}
          delay={5000}
          autohide
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto">✅ Analysis Complete</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            Your plant image has been successfully analyzed! Check the results
            below.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default DetectionPage;
