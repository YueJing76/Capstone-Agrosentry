// frontend/src/views/components/Common/Header.js
import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../../services/AuthService";
import AuthPresenter from "../../../presenters/AuthPresenter";
import logoAgrosentry from '../../../assets/images/logo-agrosentry1.png'; // Correct image path

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = AuthService.isAuthenticated();
  const currentUser = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthPresenter.setView({
      onLogoutSuccess: () => {
        navigate("/login");
      },
    });
    AuthPresenter.handleLogout();
  };

  return (
    // Changed style back to bg="dark" for a black background
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/home" className="d-flex align-items-center">
          <img
            src={logoAgrosentry}
            height="30"
            className="d-inline-block align-top me-2"
            alt="Agrosentry Logo"
          />
          Agrosentry
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/home">
                  Home
                </Nav.Link>
                <NavDropdown title="🔬 Detection" id="detection-dropdown">
                  <NavDropdown.Item as={Link} to="/detection">
                    📤 New Detection
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/history">
                    📋 History
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/stats">
                    📊 Statistics
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link as={Link} to="/about-us">
                  About Us
                </Nav.Link>
                <Nav.Link as={Link} to="/help">
                  Help
                </Nav.Link>
                <Nav.Link as={Link} to="/dashboard">
                  Dashboard
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="ms-auto">
            {isAuthenticated ? (
              <NavDropdown
                title={`👤 ${currentUser?.name || "User"}`}
                id="user-dropdown"
              >
                <NavDropdown.Item as={Link} to="/dashboard">
                  📊 Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/detection">
                  🔬 New Detection
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  🚪 Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  🔐 Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  📝 Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;