import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert, // Tidak perlu lagi Button, Spinner, Badge jika semua dihapus
} from "react-bootstrap";
import DashboardPresenter from "../../../presenters/DashboardPresenter";

const DashboardView = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    DashboardPresenter.setView({
      setLoading,
      setError,
      setProfileData,
    });

    DashboardPresenter.loadProfile();
  }, []);


  if (loading && !profileData) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          {/* Menggunakan Spinner untuk indikator loading */}
          <span className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </span>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col md={12}>
          <div className="d-flex justify-content-start align-items-center mb-4"> {/* Mengubah justify-content-between menjadi justify-content-start */}
            <h2 className="mb-0">📊 Dashboard</h2> {/* Menambahkan mb-0 untuk menghapus margin bawah */}
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col md={12}>
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col md={12} className="mb-4">
          <Card>
            <Card.Header>
              <h5>👤 Profile Information</h5>
            </Card.Header>
            <Card.Body>
              {profileData ? (
                <div>
                  <p>
                    <strong>ID:</strong>
                    {/* Menggunakan Badge di sini juga, jadi pastikan Badge tetap diimport */}
                    <span className="badge bg-secondary ms-2"> {/* Menggunakan span dengan kelas badge */}
                      {profileData.id}
                    </span>
                  </p>
                  <p>
                    <strong>Name:</strong> {profileData.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {profileData.email}
                  </p>
                  <p>
                    <strong>Member Since:</strong>{" "}
                    {new Date(profileData.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              ) : (
                <Alert variant="info">Profile data is not available</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardView;