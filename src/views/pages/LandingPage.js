// frontend/src/views/pages/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';

// Import images for Webpack to bundle them
import heroPlant from '../../assets/images/plant1.png';
import computerIcon from '../../assets/images/computer.png';
import pictureIcon from '../../assets/images/picture.png';
import searchIcon from '../../assets/images/search.png';
import fileUploadIcon from '../../assets/images/file-upload.png';
import goodFeedbackIcon from '../../assets/images/good-feedback.png';
import aboutUsImage from '../../assets/images/about-us.png';
// Import the new specific icons for "Why Choose Agrosentry?" section
import autoDetectionIcon from '../../assets/images/auto.png';
import modernAIIcon from '../../assets/images/modern.png';
import instantSuggestionsIcon from '../../assets/images/instant.png';


const LandingPage = () => {
  return (
    <>
      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1>Instant and Accurate <span className="hero-highlight">Pest Detection</span> for Your Plants</h1>
            <p className="hero-description">AgroSentry leverages AI technology to help farmers easily identify pests through images</p>
            <Link to="/detection" className="btn-primary-hero">Go to Pest Detection</Link>
          </div>
          <div className="hero-image">
            <img src={heroPlant} alt="Plant for detection" />
          </div>
        </section>

        <section className="why-choose-section">
          <h2>Why Choose Agrosentry?</h2>
          <div className="features-grid">
            <div className="feature-item">
              {/* Replaced Font Awesome icon with imported image */}
              <img src={autoDetectionIcon} alt="Automatic Detection Icon" className="icon-image" />
              <h3>Automatic Detection</h3>
              <p>Quickly identify pest types by simply uploading an image, no manual searching needed.</p>
            </div>
            <div className="feature-item">
              {/* Replaced Font Awesome icon with imported image */}
              <img src={modernAIIcon} alt="Modern AI Technology Icon" className="icon-image" />
              <h3>Modern AI Technology</h3>
              <p>Powered by deep learning and computer vision to deliver accurate and reliable results.</p>
            </div>
            <div className="feature-item">
              {/* Replaced Font Awesome icon with imported image */}
              <img src={instantSuggestionsIcon} alt="Instant Suggestions Icon" className="icon-image" />
              <h3>Instant Suggestions</h3>
              <p>Receive direct advice on how to treat and prevent pests, helping your plants thrive.</p>
            </div>
          </div>
        </section>

        <section className="how-it-works-section">
          <h2>How It Works?</h2>
          <div className="steps-grid">
            <div className="step-item">
              <img src={computerIcon} alt="Open website" />
              <div className="step-number">01</div>
              <p>Open up website</p>
            </div>
            <div className="step-item">
              <img src={pictureIcon} alt="Upload image" />
              <div className="step-number">02</div>
              <p>Upload plant image</p>
            </div>
            <div className="step-item">
              <img src={searchIcon} alt="Wait for analysis" />
              <div className="step-number">03</div>
              <p>Wait for AI analysis</p>
            </div>
            <div className="step-item">
              <img src={fileUploadIcon} alt="See results" />
              <div className="step-number">04</div>
              <p>See detection results & recommendations</p>
            </div>
            <div className="step-item">
              <img src={goodFeedbackIcon} alt="Take action" />
              <div className="step-number">05</div>
              <p>Take recommended action</p>
            </div>
          </div>
        </section>

        <section className="about-us-section">
          <h2>About Us</h2>
          <div className="about-content">
            <div className="about-image">
              <img src={aboutUsImage} alt="Farmer" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
            <div className="about-text">
              <h3>Empowering Farmers with Smart Technology</h3>
              <p>We believe that the future of farming lies in precision and accessibility. This app revolutionizes agriculture and empowers farmers to make pest detection simple, fast, and accurate—just by uploading a photo. By combining machine learning with intuitive design, Agrosentry offers smart solutions for a thriving agricultural and more sustainable agriculture.</p>
              <Link to="/about-us" className="btn-read-more">Read More</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-column contact-us">
            <h4>Contact Us</h4>
            <p>info@agrosentry.com</p>
          </div>
          <div className="footer-column menu">
            <h4>Menu</h4>
            <ul>
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/detection">Pest Detection</Link></li>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li> {/* <-- NEW: Added Dashboard link */}
            </ul>
          </div>
          <div className="footer-column help">
            <h4>Help</h4>
            <ul>
              <li><Link to="/help">FAQ</Link></li>
              <li><Link to="/help">User Guide</Link></li>
              <li><Link to="/help">Contact Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Agrosentry. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;