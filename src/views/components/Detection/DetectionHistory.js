// src/views/components/Detection/DetectionHistory.js
import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Table,
  Badge,
  Button,
  Spinner,
  Alert,
  Pagination,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import DetectionService from "../../../services/DetectionService";

const DetectionHistory = ({ onViewDetails }) => {
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDetections, setFilteredDetections] = useState([]);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      console.log("🔄 Loading detection history...");
      const response = await DetectionService.getDetectionHistory(
        currentPage,
        10
      );

      if (response.success) {
        console.log("✅ History loaded successfully:", response.data);
        setDetections(response.data.detections || []);
        setFilteredDetections(response.data.detections || []);
      } else {
        throw new Error(response.error || "Failed to load history");
      }
    } catch (err) {
      console.error("❌ Error loading history:", err);
      setError(err.message || "Failed to load detection history");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    // Filter detections based on search term
    if (!searchTerm) {
      setFilteredDetections(detections);
    } else {
      const filtered = detections.filter(
        (detection) =>
          detection.predicted_disease
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          detection.original_filename
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredDetections(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, detections]);

  const getConfidenceColor = (confidence) => {
    const conf = parseFloat(confidence);
    if (conf >= 0.8) return "success";
    if (conf >= 0.6) return "warning";
    if (conf >= 0.4) return "info";
    return "secondary";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRefresh = () => {
    loadHistory();
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredDetections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDetections = filteredDetections.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading detection history...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">📋 Detection History</h5>
          <Badge bg="primary">{filteredDetections.length} Records</Badge>
        </div>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            <Alert.Heading>❌ Error Loading History</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={handleRefresh}>
              🔄 Retry
            </Button>
          </Alert>
        )}

        {/* Search and Filter */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="🔍 Search by disease name or filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={6} className="text-end">
            <Button
              variant="outline-primary"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-1" />
                  Loading...
                </>
              ) : (
                "🔄 Refresh"
              )}
            </Button>
          </Col>
        </Row>

        {filteredDetections.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-3">
              <i className="fas fa-microscope fa-3x text-muted"></i>
            </div>
            <h6>No Detection History Found</h6>
            <p className="text-muted">
              {searchTerm
                ? "No results match your search criteria."
                : "Start by uploading your first plant image for analysis."}
            </p>
            {!searchTerm && (
              <Button variant="primary" href="/detection">
                📤 Upload First Image
              </Button>
            )}
          </div>
        ) : (
          <>
            <Table responsive hover>
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>Image</th>
                  <th>Filename</th>
                  <th>Detected Disease</th>
                  <th>Confidence</th>
                  <th>Severity</th>
                  <th>Date</th>
                  <th style={{ width: "120px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentDetections.map((detection) => (
                  <tr key={detection.id}>
                    <td>
                      <img
                        src={`http://localhost:3000${detection.image_url}`}
                        alt="Detected plant"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0MFY0MEgyMFYyMFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPC9zdmc+";
                        }}
                      />
                    </td>
                    <td>
                      <div>
                        <div
                          className="fw-bold text-truncate"
                          style={{ maxWidth: "150px" }}
                        >
                          {detection.original_filename}
                        </div>
                        <small className="text-muted">ID: {detection.id}</small>
                      </div>
                    </td>
                    <td>
                      <span className="fw-bold">
                        {detection.predicted_disease || "Unknown"}
                      </span>
                    </td>
                    <td>
                      <Badge bg={getConfidenceColor(detection.confidence)}>
                        {(parseFloat(detection.confidence || 0) * 100).toFixed(
                          1
                        )}
                        %
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="info" className="small">
                        {detection.severity_level || "Unknown"}
                      </Badge>
                    </td>
                    <td>
                      <small>{formatDate(detection.created_at)}</small>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                          onViewDetails && onViewDetails(detection.id)
                        }
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <Pagination>
                  <Pagination.First
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  />

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Pagination.Item
                          key={page}
                          active={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Pagination.Item>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <Pagination.Ellipsis key={page} />;
                    }
                    return null;
                  })}

                  <Pagination.Next
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default DetectionHistory;
