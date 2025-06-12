import React from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthService from "../../services/AuthService";

const HomePage = () => {
  const isAuthenticated = AuthService.isAuthenticated();
  const currentUser = AuthService.getCurrentUser();

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="text-center shadow">
            <Card.Body className="py-5">
              <h1 className="display-4 mb-4">🚀 Welcome to Auth MVP App!</h1>

              {isAuthenticated ? (
                <div>
                  <h3 className="mb-3">
                    Halo, <Badge bg="primary">{currentUser?.name}</Badge>! 👋
                  </h3>
                  <p className="lead mb-4">
                    Selamat datang kembali di dashboard Anda.
                  </p>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <Button
                      as={Link}
                      to="/dashboard"
                      variant="primary"
                      size="lg"
                    >
                      📊 Go to Dashboard
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => window.location.reload()}
                    >
                      🔄 Refresh
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="lead mb-4">
                    Aplikasi Authentication dengan React.js & Node.js
                    menggunakan arsitektur MVP
                  </p>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <Button as={Link} to="/login" variant="primary" size="lg">
                      🔐 Login
                    </Button>
                    <Button
                      as={Link}
                      to="/register"
                      variant="outline-primary"
                      size="lg"
                    >
                      📝 Register
                    </Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Features Section */}
      <Row className="mt-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="mb-3">
                <h2 className="text-primary">🔐</h2>
              </div>
              <h5>Secure Authentication</h5>
              <p className="text-muted">
                JWT-based authentication dengan encryption yang aman dan token
                management otomatis
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="mb-3">
                <h2 className="text-success">⚡</h2>
              </div>
              <h5>MVP Architecture</h5>
              <p className="text-muted">
                Arsitektur MVP (Model-View-Presenter) yang clean, scalable, dan
                mudah di-maintain
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="mb-3">
                <h2 className="text-warning">🛡️</h2>
              </div>
              <h5>Protected Routes</h5>
              <p className="text-muted">
                Route protection dan authorization untuk keamanan aplikasi yang
                maksimal
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* API Status Section */}
      <Row className="mt-4">
        <Col md={12}>
          <Card className="bg-light">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">🔌 API Status</h6>
                  <small className="text-muted">
                    Backend API tersambung di{" "}
                    {process.env.REACT_APP_API_BASE_URL ||
                      "http://localhost:3000/api"}
                  </small>
                </div>
                <Badge bg="success">Connected</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Info */}
      {!isAuthenticated && (
        <Row className="mt-4">
          <Col md={12}>
            <Card className="border-primary">
              <Card.Body>
                <h6>💡 Quick Start:</h6>
                <ul className="mb-0">
                  <li>
                    Klik <strong>Register</strong> untuk membuat akun baru
                  </li>
                  <li>
                    Atau klik <strong>Login</strong> jika sudah memiliki akun
                  </li>
                  <li>Setelah login, Anda akan diarahkan ke dashboard</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default HomePage;
