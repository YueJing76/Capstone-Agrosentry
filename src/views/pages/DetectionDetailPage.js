import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Badge,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import DetectionPresenter from "../../presenters/DetectionPresenter";

const DetectionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detection, setDetection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    DetectionPresenter.setView({
      setLoading,
      setError,
      setDetection: (data) => {
        setDetection(data);
      },
    });

    if (id) {
      DetectionPresenter.loadDetectionById(id);
    }
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return "success";
    if (confidence >= 0.6) return "warning";
    if (confidence >= 0.4) return "info";
    return "secondary";
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading detection details...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Detection</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => navigate("/history")}>
            ← Back to History
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!detection) {
    return (
      <Container className="py-4">
        <Alert variant="warning">
          <Alert.Heading>Detection Not Found</Alert.Heading>
          <p>The requested detection could not be found.</p>
          <Button
            variant="outline-warning"
            onClick={() => navigate("/history")}
          >
            ← Back to History
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>🔬 Detection Details</h2>
          <p className="text-muted mb-0">Detection ID: {detection.id}</p>
        </div>
        <Button
          variant="outline-secondary"
          onClick={() => navigate("/history")}
        >
          ← Back to History
        </Button>
      </div>

      <Row>
        {/* Image and Basic Info */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">📸 Analyzed Image</h5>
            </Card.Header>
            <Card.Body>
              <img
                src={`http://localhost:3000${detection.image_url}`}
                alt="Analyzed plant"
                className="img-fluid rounded mb-3"
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "contain",
                }}
              />

              <div className="mb-2">
                <strong>Filename:</strong> {detection.original_filename}
              </div>
              <div className="mb-2">
                <strong>Analysis Date:</strong>{" "}
                {formatDate(detection.created_at)}
              </div>
              <div className="mb-2">
                <strong>Detection ID:</strong>
                <Badge bg="secondary" className="ms-2">
                  {detection.id}
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Detection Results */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">🎯 Detection Results</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6>Primary Detection:</h6>
                <h4 className="text-primary mb-2">
                  {detection.predicted_disease}
                </h4>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Confidence Level:</span>
                    <Badge
                      bg={getConfidenceColor(parseFloat(detection.confidence))}
                    >
                      {(parseFloat(detection.confidence) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className={`progress-bar bg-${getConfidenceColor(parseFloat(detection.confidence))}`}
                      style={{
                        width: `${parseFloat(detection.confidence) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="mb-3">
                  <strong>Severity Level:</strong>
                  <Badge bg="info" className="ms-2">
                    {detection.severity_level}
                  </Badge>
                </div>
              </div>

              {/* All Predictions */}
              {detection.all_predictions &&
                detection.all_predictions.length > 1 && (
                  <div>
                    <h6>All Predictions:</h6>
                    <div className="list-group list-group-flush">
                      {detection.all_predictions
                        .slice(0, 5)
                        .map((pred, index) => (
                          <div
                            key={index}
                            className="list-group-item px-0 py-2"
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <span>{pred.class_name}</span>
                              <Badge bg={getConfidenceColor(pred.confidence)}>
                                {(pred.confidence * 100).toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Disease Information */}
      {detection.disease_info && (
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">ℹ️ Disease Information</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={8}>
                <h6 className="text-primary">{detection.disease_info.name}</h6>
                <p className="mb-3">{detection.disease_info.description}</p>

                <div className="row">
                  <div className="col-md-6">
                    <h6>🩺 Symptoms:</h6>
                    <ul>
                      {detection.disease_info.symptoms?.map(
                        (symptom, index) => (
                          <li key={index}>{symptom}</li>
                        )
                      )}
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>🔍 Causes:</h6>
                    <p>{detection.disease_info.causes}</p>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center">
                  <h6>Severity Level</h6>
                  <Badge
                    bg={
                      detection.disease_info.severity === "High"
                        ? "danger"
                        : detection.disease_info.severity === "Medium"
                          ? "warning"
                          : "success"
                    }
                    className="px-3 py-2"
                    style={{ fontSize: "1rem" }}
                  >
                    {detection.disease_info.severity}
                  </Badge>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Recommendations */}
      {detection.recommendations && (
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">💡 Treatment Recommendations</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <Card className="h-100 border-0 bg-light">
                  <Card.Header className="bg-primary text-white">
                    <h6 className="mb-0">🛡️ Prevention</h6>
                  </Card.Header>
                  <Card.Body>
                    <ul className="mb-0">
                      {detection.recommendations.prevention?.map(
                        (item, index) => (
                          <li key={index}>{item}</li>
                        )
                      )}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100 border-0 bg-light">
                  <Card.Header className="bg-warning text-dark">
                    <h6 className="mb-0">💊 Treatment</h6>
                  </Card.Header>
                  <Card.Body>
                    <ul className="mb-0">
                      {detection.recommendations.treatment?.map(
                        (item, index) => (
                          <li key={index}>{item}</li>
                        )
                      )}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100 border-0 bg-light">
                  <Card.Header className="bg-success text-white">
                    <h6 className="mb-0">🌿 Organic Solutions</h6>
                  </Card.Header>
                  <Card.Body>
                    <ul className="mb-0">
                      {detection.recommendations.organic?.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="d-flex gap-2 justify-content-center">
        <Button
          variant="outline-primary"
          onClick={() => navigate("/detection")}
        >
          🔄 New Detection
        </Button>
        <Button variant="outline-success" onClick={() => window.print()}>
          🖨️ Print Report
        </Button>
        <Button variant="outline-info" onClick={() => navigate("/stats")}>
          📊 View Statistics
        </Button>
      </div>
    </Container>
  );
};

export default DetectionDetailPage;
