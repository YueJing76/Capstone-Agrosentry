// src/views/components/Detection/DetectionResult.js
import React, { useEffect, useState } from "react";
import {
  Card,
  Badge,
  ProgressBar,
  Button,
  Row,
  Col,
  ListGroup,
  Alert,
} from "react-bootstrap";

const DetectionResult = ({ result, onViewDetails }) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (result) {
      // Trigger animation when result appears
      setTimeout(() => setShowAnimation(true), 100);
    }
  }, [result]);

  if (!result) return null;

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return "success";
    if (confidence >= 0.6) return "warning";
    if (confidence >= 0.4) return "info";
    return "secondary";
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high confidence":
        return "success";
      case "medium confidence":
        return "warning";
      case "low confidence":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <div className={`fade-in ${showAnimation ? "show" : ""}`}>
      <Alert variant="success" className="mb-4">
        <div className="d-flex align-items-center">
          <i className="fas fa-check-circle fa-2x me-3"></i>
          <div>
            <Alert.Heading className="h5 mb-1">
              ✅ Analysis Complete!
            </Alert.Heading>
            <p className="mb-0">
              Your plant image has been successfully analyzed. Here are the
              results:
            </p>
          </div>
        </div>
      </Alert>

      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">🔬 Detection Results</h5>
            <Badge bg="light" text="dark">
              {result.prediction.severity_level}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              {result.image_url && (
                <div className="mb-3">
                  <img
                    src={`http://localhost:3000${result.image_url}`}
                    alt="Analyzed plant"
                    className="img-fluid rounded shadow-sm"
                    style={{
                      maxHeight: "300px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </Col>
            <Col md={6}>
              <div className="mb-4">
                <h6 className="text-primary">🎯 Primary Detection:</h6>
                <h4 className="text-dark mb-3">
                  {result.prediction.disease_name}
                </h4>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-bold">Confidence Level:</span>
                    <Badge
                      bg={getConfidenceColor(result.prediction.confidence)}
                      className="px-3"
                    >
                      {(result.prediction.confidence * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <ProgressBar
                    now={result.prediction.confidence * 100}
                    variant={getConfidenceColor(result.prediction.confidence)}
                    style={{ height: "12px" }}
                    className="shadow-sm"
                  />
                </div>
              </div>

              {result.prediction.all_predictions &&
                result.prediction.all_predictions.length > 1 && (
                  <div className="mb-3">
                    <h6 className="text-primary">📊 Alternative Detections:</h6>
                    <ListGroup variant="flush">
                      {result.prediction.all_predictions
                        .slice(1, 4)
                        .map((pred, index) => (
                          <ListGroup.Item key={index} className="px-0 py-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="small">{pred.class_name}</span>
                              <Badge bg={getConfidenceColor(pred.confidence)}>
                                {(pred.confidence * 100).toFixed(1)}%
                              </Badge>
                            </div>
                          </ListGroup.Item>
                        ))}
                    </ListGroup>
                  </div>
                )}
            </Col>
          </Row>

          {/* Rest of the component remains the same */}
          {result.disease_info && (
            <div className="mb-4">
              <h6 className="text-primary">ℹ️ Disease Information:</h6>
              <Card className="bg-light border-0">
                <Card.Body className="py-3">
                  <Row>
                    <Col md={8}>
                      <h6 className="text-dark">{result.disease_info.name}</h6>
                      <p className="mb-2 small">
                        {result.disease_info.description}
                      </p>
                      <div className="row">
                        <div className="col-md-6">
                          <strong className="small text-primary">
                            Symptoms:
                          </strong>
                          <ul className="small mb-0 mt-1">
                            {result.disease_info.symptoms?.map(
                              (symptom, index) => (
                                <li key={index}>{symptom}</li>
                              )
                            )}
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <strong className="small text-primary">
                            Severity:
                          </strong>
                          <div className="mt-1">
                            <Badge bg="info">
                              {result.disease_info.severity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          )}

          {result.recommendations && (
            <div className="mb-4">
              <h6 className="text-primary">💡 Treatment Recommendations:</h6>
              <Row>
                <Col md={4}>
                  <Card
                    className="h-100 border-primary"
                    style={{ fontSize: "0.9rem" }}
                  >
                    <Card.Header className="bg-primary text-white py-2">
                      <strong>🛡️ Prevention</strong>
                    </Card.Header>
                    <Card.Body className="py-2">
                      <ul className="mb-0 small">
                        {result.recommendations.prevention?.map(
                          (item, index) => (
                            <li key={index}>{item}</li>
                          )
                        )}
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card
                    className="h-100 border-warning"
                    style={{ fontSize: "0.9rem" }}
                  >
                    <Card.Header className="bg-warning text-dark py-2">
                      <strong>💊 Treatment</strong>
                    </Card.Header>
                    <Card.Body className="py-2">
                      <ul className="mb-0 small">
                        {result.recommendations.treatment?.map(
                          (item, index) => (
                            <li key={index}>{item}</li>
                          )
                        )}
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card
                    className="h-100 border-success"
                    style={{ fontSize: "0.9rem" }}
                  >
                    <Card.Header className="bg-success text-white py-2">
                      <strong>🌿 Organic Solutions</strong>
                    </Card.Header>
                    <Card.Body className="py-2">
                      <ul className="mb-0 small">
                        {result.recommendations.organic?.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          <div className="d-flex gap-2 justify-content-center">
            <Button
              variant="primary"
              onClick={() =>
                onViewDetails && onViewDetails(result.detection_id)
              }
            >
              📄 View Full Details
            </Button>
            <Button variant="outline-success" onClick={() => window.print()}>
              🖨️ Print Report
            </Button>
            <Button
              variant="outline-info"
              onClick={() => (window.location.href = "/history")}
            >
              📋 View History
            </Button>
          </div>
        </Card.Body>
      </Card>

      <style jsx>{`
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.5s ease-in-out;
        }
        .fade-in.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default DetectionResult;
