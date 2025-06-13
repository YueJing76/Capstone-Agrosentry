import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DetectionHistory from "../components/Detection/DetectionHistory";

const HistoryPage = () => {
  const navigate = useNavigate();

  const handleViewDetails = (detectionId) => {
    navigate(`/detection/detail/${detectionId}`);
  };

  return (
    <Container className="py-4">
      <div className="mb-4">
        <h2>📋 Detection History</h2>
        <p className="text-muted">
          View all your previous plant disease detection results
        </p>
      </div>

      <DetectionHistory onViewDetails={handleViewDetails} />
    </Container>
  );
};

export default HistoryPage;
