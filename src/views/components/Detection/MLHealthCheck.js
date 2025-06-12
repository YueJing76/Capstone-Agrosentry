import React, { useState, useEffect } from "react";
import { Card, Alert, Button, Badge, Spinner, Table } from "react-bootstrap";
import DetectionPresenter from "../../../presenters/DetectionPresenter";

const MLHealthCheck = () => {
  const [mlHealth, setMLHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    DetectionPresenter.setView({
      setLoading,
      setError,
      setMLHealth: (data) => {
        setMLHealth(data);
        setLastChecked(new Date());
      },
    });

    // Auto check on component mount
    handleHealthCheck();
  }, []);

  const handleHealthCheck = () => {
    DetectionPresenter.checkMLServiceHealth();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "healthy":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "danger";
      default:
        return "secondary";
    }
  };

  const formatLastChecked = () => {
    if (!lastChecked) return "Never";
    return lastChecked.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">🤖 ML Service Health Status</h5>
          <div className="d-flex align-items-center gap-2">
            {mlHealth && (
              <Badge bg={getStatusColor(mlHealth.status)} className="me-2">
                {mlHealth.status || "Unknown"}
              </Badge>
            )}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleHealthCheck}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-1" />
                  Checking...
                </>
              ) : (
                "🔄 Check Status"
              )}
            </Button>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            <Alert.Heading>❌ Health Check Failed</Alert.Heading>
            <p className="mb-0">{error}</p>
          </Alert>
        )}

        {mlHealth ? (
          <div>
            {/* Status Overview */}
            <div className="row mb-4">
              <div className="col-md-3 text-center">
                <div className="mb-2">
                  <i
                    className={`fas fa-robot fa-3x ${
                      mlHealth.status === "healthy"
                        ? "text-success"
                        : "text-danger"
                    }`}
                  ></i>
                </div>
                <h6>Service Status</h6>
                <Badge
                  bg={getStatusColor(mlHealth.status)}
                  className="px-3 py-2"
                >
                  {mlHealth.status || "Unknown"}
                </Badge>
              </div>
              <div className="col-md-3 text-center">
                <div className="mb-2">
                  <i
                    className={`fas fa-brain fa-3x ${
                      mlHealth.model_loaded ? "text-success" : "text-danger"
                    }`}
                  ></i>
                </div>
                <h6>Model Status</h6>
                <Badge
                  bg={mlHealth.model_loaded ? "success" : "danger"}
                  className="px-3 py-2"
                >
                  {mlHealth.model_loaded ? "Loaded" : "Not Loaded"}
                </Badge>
              </div>
              <div className="col-md-3 text-center">
                <div className="mb-2">
                  <i className="fas fa-clock fa-3x text-info"></i>
                </div>
                <h6>Last Checked</h6>
                <Badge bg="info" className="px-3 py-2">
                  {formatLastChecked()}
                </Badge>
              </div>
              <div className="col-md-3 text-center">
                <div className="mb-2">
                  <i className="fas fa-server fa-3x text-secondary"></i>
                </div>
                <h6>Service Type</h6>
                <Badge bg="secondary" className="px-3 py-2">
                  ML Prediction
                </Badge>
              </div>
            </div>

            {/* Detailed Information */}
            <Table bordered hover>
              <tbody>
                <tr>
                  <td style={{ width: "30%" }}>
                    <strong>Service Status</strong>
                  </td>
                  <td>
                    <Badge bg={getStatusColor(mlHealth.status)}>
                      {mlHealth.status || "Unknown"}
                    </Badge>
                    {mlHealth.status === "healthy" && (
                      <span className="text-success ms-2">
                        ✓ Service is running normally
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Model Loaded</strong>
                  </td>
                  <td>
                    <Badge bg={mlHealth.model_loaded ? "success" : "danger"}>
                      {mlHealth.model_loaded ? "Yes" : "No"}
                    </Badge>
                    {mlHealth.model_loaded ? (
                      <span className="text-success ms-2">
                        ✓ ML model is ready for predictions
                      </span>
                    ) : (
                      <span className="text-danger ms-2">
                        ✗ ML model is not available
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Last Health Check</strong>
                  </td>
                  <td>
                    <code>{formatLastChecked()}</code>
                    <span className="text-muted ms-2">
                      ({lastChecked ? "Just checked" : "Never checked"})
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Service Message</strong>
                  </td>
                  <td>{mlHealth.message || "ML Service is running"}</td>
                </tr>
              </tbody>
            </Table>

            {/* System Requirements */}
            <Alert variant="info" className="mt-3">
              <Alert.Heading>ℹ️ System Information</Alert.Heading>
              <ul className="mb-0">
                <li>
                  <strong>Service URL:</strong> http://localhost:5001
                </li>
                <li>
                  <strong>Expected Response Time:</strong> {"< 30 seconds"}
                </li>
                <li>
                  <strong>Model Type:</strong> TensorFlow H5 Model
                </li>
                <li>
                  <strong>Supported Formats:</strong> JPEG, PNG, GIF
                </li>
                <li>
                  <strong>Max File Size:</strong> 10MB
                </li>
              </ul>
            </Alert>

            {/* Troubleshooting */}
            {(!mlHealth.model_loaded || mlHealth.status !== "healthy") && (
              <Alert variant="warning" className="mt-3">
                <Alert.Heading>⚠️ Troubleshooting</Alert.Heading>
                <p>If the ML service is not working properly:</p>
                <ol>
                  <li>Ensure Python ML service is running on port 5001</li>
                  <li>Check if the model.h5 file is in the correct location</li>
                  <li>Verify all Python dependencies are installed</li>
                  <li>Check the console logs for detailed error messages</li>
                  <li>Try restarting the ML service</li>
                </ol>
              </Alert>
            )}
          </div>
        ) : loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2">Checking ML service health...</p>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="mb-3">
              <i className="fas fa-robot fa-3x text-muted"></i>
            </div>
            <h6>ML Service Status Unknown</h6>
            <p className="text-muted">
              Click "Check Status" to verify ML service health
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default MLHealthCheck;
