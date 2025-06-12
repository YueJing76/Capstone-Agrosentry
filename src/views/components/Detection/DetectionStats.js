import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  ProgressBar,
  Alert,
  Spinner,
  Badge,
  Table,
} from "react-bootstrap";
import DetectionPresenter from "../../../presenters/DetectionPresenter";

const DetectionStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    DetectionPresenter.setView({
      setLoading,
      setError,
      setStats: (data) => {
        setStats(data);
      },
    });

    DetectionPresenter.loadDetectionStats();
  }, []);

  const getColorByPercentage = (percentage) => {
    if (percentage >= 40) return "danger";
    if (percentage >= 20) return "warning";
    if (percentage >= 10) return "info";
    return "success";
  };

  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading statistics...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Card.Body>
          <Alert variant="danger">{error}</Alert>
        </Card.Body>
      </Card>
    );
  }

  if (!stats || stats.total_detections === 0) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <div className="mb-3">
            <i className="fas fa-chart-pie fa-3x text-muted"></i>
          </div>
          <h6>No Statistics Available</h6>
          <p className="text-muted">
            Start uploading plant images to see your detection statistics.
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      {/* Overview Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="mb-2">
                <i className="fas fa-microscope fa-2x text-primary"></i>
              </div>
              <h3 className="text-primary mb-1">{stats.total_detections}</h3>
              <small className="text-muted">Total Detections</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="mb-2">
                <i className="fas fa-bug fa-2x text-warning"></i>
              </div>
              <h3 className="text-warning mb-1">{stats.unique_diseases}</h3>
              <small className="text-muted">Unique Diseases</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="mb-2">
                <i className="fas fa-bullseye fa-2x text-success"></i>
              </div>
              <h3 className="text-success mb-1">
                {(stats.average_confidence * 100).toFixed(1)}%
              </h3>
              <small className="text-muted">Avg Confidence</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="mb-2">
                <i className="fas fa-calendar fa-2x text-info"></i>
              </div>
              <h3 className="text-info mb-1">
                {Math.ceil(stats.total_detections / 30)}
              </h3>
              <small className="text-muted">Detections/Month</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Disease Breakdown */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">📊 Disease Distribution</h5>
        </Card.Header>
        <Card.Body>
          {stats.disease_breakdown && stats.disease_breakdown.length > 0 ? (
            <>
              {/* Progress Bars */}
              <div className="mb-4">
                {stats.disease_breakdown.slice(0, 5).map((disease, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-bold">{disease.disease_name}</span>
                      <span>
                        <Badge
                          bg={getColorByPercentage(
                            parseFloat(disease.percentage)
                          )}
                        >
                          {disease.count} ({disease.percentage}%)
                        </Badge>
                      </span>
                    </div>
                    <ProgressBar
                      now={parseFloat(disease.percentage)}
                      variant={getColorByPercentage(
                        parseFloat(disease.percentage)
                      )}
                      style={{ height: "8px" }}
                    />
                  </div>
                ))}
              </div>

              {/* Detailed Table */}
              <h6>📋 Detailed Breakdown</h6>
              <Table responsive hover size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Disease Name</th>
                    <th>Count</th>
                    <th>Percentage</th>
                    <th>Impact Level</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.disease_breakdown.map((disease, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="fw-bold">{disease.disease_name}</td>
                      <td>
                        <Badge bg="secondary">{disease.count}</Badge>
                      </td>
                      <td>
                        <ProgressBar
                          now={parseFloat(disease.percentage)}
                          variant={getColorByPercentage(
                            parseFloat(disease.percentage)
                          )}
                          style={{ height: "6px", width: "100px" }}
                          className="d-inline-block me-2"
                        />
                        {disease.percentage}%
                      </td>
                      <td>
                        <Badge
                          bg={getColorByPercentage(
                            parseFloat(disease.percentage)
                          )}
                        >
                          {parseFloat(disease.percentage) >= 40
                            ? "High"
                            : parseFloat(disease.percentage) >= 20
                              ? "Medium"
                              : parseFloat(disease.percentage) >= 10
                                ? "Low"
                                : "Minimal"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          ) : (
            <div className="text-center py-3">
              <p className="text-muted">No disease data available</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Insights Card */}
      <Card className="mt-4">
        <Card.Header>
          <h5 className="mb-0">💡 Insights & Recommendations</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h6>📈 Key Statistics:</h6>
              <ul>
                <li>
                  You've performed <strong>{stats.total_detections}</strong>{" "}
                  detections
                </li>
                <li>
                  <strong>{stats.unique_diseases}</strong> different
                  diseases/pests identified
                </li>
                <li>
                  Average detection confidence:{" "}
                  <strong>
                    {(stats.average_confidence * 100).toFixed(1)}%
                  </strong>
                </li>
                {stats.disease_breakdown &&
                  stats.disease_breakdown.length > 0 && (
                    <li>
                      Most common issue:{" "}
                      <strong>{stats.disease_breakdown[0].disease_name}</strong>
                      ({stats.disease_breakdown[0].percentage}%)
                    </li>
                  )}
              </ul>
            </Col>
            <Col md={6}>
              <h6>🎯 Recommendations:</h6>
              <ul>
                {stats.average_confidence < 0.6 && (
                  <li className="text-warning">
                    Consider uploading clearer images for better detection
                    accuracy
                  </li>
                )}
                {stats.disease_breakdown &&
                  stats.disease_breakdown[0] &&
                  parseFloat(stats.disease_breakdown[0].percentage) > 50 && (
                    <li className="text-danger">
                      High frequency of{" "}
                      {stats.disease_breakdown[0].disease_name} detected -
                      consider preventive measures
                    </li>
                  )}
                <li>Regular monitoring helps early detection and treatment</li>
                <li>
                  Keep track of seasonal patterns in your detection history
                </li>
              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DetectionStats;
