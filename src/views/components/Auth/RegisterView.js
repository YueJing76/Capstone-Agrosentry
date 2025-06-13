import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AuthPresenter from "../../../presenters/AuthPresenter";
import registerImage from '../../../assets/images/login.jpg'; // Correct image path

const RegisterView = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    AuthPresenter.setView({
      setLoading,
      setError,
      showSuccess: setSuccess,
      onRegisterSuccess: (userData) => {
        // Change this line to redirect to the login page
        setTimeout(() => {
          navigate("/login"); // <--- CHANGED: Redirect to login page
        }, 1000);
      },
    });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    AuthPresenter.handleRegister(formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="body-auth">
      <div className="left-panel" style={{ backgroundImage: `url(${registerImage})` }}>
        {/* Background image set dynamically */}
      </div>
      <div className="right-panel">
        <div className="form-wrapper">
          <h2>Register</h2>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mb-3">
              {success}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="name"
                placeholder="full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="registerEmail">Email</label>
              <input
                type="email"
                id="registerEmail"
                name="email"
                placeholder="username@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="registerPassword">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="registerPassword"
                  name="password"
                  placeholder="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <i
                  className={`far ${showPassword ? "fa-eye" : "fa-eye-slash"} toggle-password`}
                  onClick={togglePasswordVisibility}
                ></i>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <i
                  className={`far ${showPassword ? "fa-eye" : "fa-eye-slash"} toggle-password`}
                  onClick={togglePasswordVisibility}
                ></i>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Loading...
                </>
              ) : (
                "Register"
              )}
            </button>
          </Form>

          <p className="bottom-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;