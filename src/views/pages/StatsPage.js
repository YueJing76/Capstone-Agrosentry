import React from "react";
import { Container } from "react-bootstrap";
import DetectionStats from "../components/Detection/DetectionStats";

const StatsPage = () => {
  return (
    <Container className="py-4">
      <div className="mb-4">
        <h2>📊 Detection Statistics</h2>
        <p className="text-muted">
          Analyze your plant health monitoring patterns and trends
        </p>
      </div>

      <DetectionStats />
    </Container>
  );
};

export default StatsPage;
