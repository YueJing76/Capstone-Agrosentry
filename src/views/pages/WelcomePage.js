// frontend/src/views/pages/WelcomePage.js
import React from "react";
import { Link } from "react-router-dom";
// Ensure you import the image for Webpack to process it
import awalanImage from '../../assets/images/background1.jpg'; // Adjust path if needed

const WelcomePage = () => {
  return (
    <div className="body-welcome"> {/* Apply a specific class for body styling */}
      <div className="left-panel home-left-panel" style={{ backgroundImage: `url(${awalanImage})` }}>
        {/* The background image is now directly set via inline style to use the imported image */}
      </div>
      <div className="right-panel">
        <div className="form-wrapper">
          <h2>Welcome to AgroSentry!</h2>
          <p className="welcome-slogan">
            Find innovative solutions for your farm
          </p>
          <div className="button-group"> {/* Add a wrapper for buttons */}
            <Link to="/login" className="btn-home-login">
              Login
            </Link>
            <Link to="/register" className="btn-home-register">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;