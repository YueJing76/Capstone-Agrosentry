// frontend/src/views/components/Auth/LoginView.js
import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AuthPresenter from "../../../presenters/AuthPresenter";
import loginImage from '../../../assets/images/login.jpg'; // Correct image path

const LoginView = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      onLoginSuccess: (userData) => { //
        setTimeout(() => {
          navigate("/home"); // <-- PERUBAHAN DI SINI: Redirect ke halaman /home
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
    AuthPresenter.handleLogin(formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="body-auth">
      <div className="left-panel" style={{ backgroundImage: `url(${loginImage})` }}>
      </div>
      <div className="right-panel">
        <div className="form-wrapper">
          <h2>Login</h2>
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
              <label htmlFor="loginEmail">Email</label>
              <input
                type="email"
                id="loginEmail"
                name="email"
                placeholder="username@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="loginPassword">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="loginPassword"
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

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </button>
          </Form>

          <p className="bottom-text">
            Don't have an account yet?{" "}
            <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;