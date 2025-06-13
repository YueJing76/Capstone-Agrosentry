// frontend/src/views/pages/AboutUsPage.js
import React from 'react';
import { Link } from 'react-router-dom';

// Import all necessary images for Webpack
import aboutHeroImage from '../../assets/images/about.png'; // Assuming 'about.png' is your hero image
import visionImage from '../../assets/images/right.png'; // Assuming 'right.png' for vision
import missionImage from '../../assets/images/left.png';   // Assuming 'left.png' for mission
import core1Image from '../../assets/images/core1.png';
import core2Image from '../../assets/images/core2.png';
import core3Image from '../../assets/images/core3.png';
import customer1Image from '../../assets/images/customer1.png';
import customer2Image from '../../assets/images/customer2.png';
import customer3Image from '../../assets/images/customer3.png';
import customer4Image from '../../assets/images/customer4.png';


const AboutUsPage = () => {
  return (
    <main>
      <section className="about-hero-new" style={{ backgroundImage: `url(${aboutHeroImage})` }}>
        {/* The background pseudo-element CSS will handle the image in globals.css,
            but we include it here just for dynamic reference if needed or for clarity.
            For this specific pseudo-element usage, the background property is in CSS.
            We'll adjust the CSS to directly use the URL.
            If you want to pass it dynamically, you'd adjust the CSS to take a variable,
            or you'd use a div with the background image set directly.
            For now, let's keep the CSS background as it is for the pseudo-element.
            So, the 'style' prop below is actually not strictly needed if pseudo-element handles it.
        */}
        <div className="hero-content-new">
          <h1>Get to Know Us</h1>
          <p>Empowering farmers with smarter, AI-driven agricultural tools</p>
        </div>
      </section>

      <section className="vision-mission-section">
        <div className="container">
          <div className="vision-section-layout">
            <div className="vision-text-content">
              <h2>Vision</h2>
              <p>To revolutionize agriculture by providing intelligent, accessible, and sustainable digital tools that empower farmers to make data-driven decisions and protect their crops more efficiently.</p>
            </div>
            <div className="vision-image">
              <img src={visionImage} alt="Vision Image" />
            </div>
          </div>

          <div className="mission-section-layout">
            <div className="mission-image">
              <img src={missionImage} alt="Mission Image" />
            </div>
            <div className="mission-text-content">
              <h2>Mission</h2>
              <ul>
                <li>To simplify the process of pest identification through AI-based image analysis, enabling users to take quick and informed actions.</li>
                <li>To close the gap between traditional farming methods and digital innovation, making technology accessible and user-friendly for all farmers.</li>
                <li>To promote long-term sustainability by providing intelligent recommendations and tools that enhance productivity while protecting the environment.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="about-us-info-section">
        <div className="container about-us-info-container">
          <div className="about-us-info-heading-wrapper">
            <h2>About Us</h2>
          </div>
          <div className="green-vertical-separator"></div>
          <div className="about-us-info-right">
            <p>At AgroSentry, we believe that the future of farming lies in precision, innovation, and accessibility. This web-based platform leverages artificial intelligence to make pest detection simple, fast, and accurate – just by analyzing a photo.</p>
            <p>Born from a vision to empower farmers with digital tools, AgroSentry combines the power of machine learning, intuitive design, and practical agricultural insights to address real-world challenges in the field. With AgroSentry, users can easily upload images of affected plants, receive instant pest identification, and gain actionable recommendations to protect their crops.</p>
            <p>Our platform is designed to be inclusive and user-friendly, ensuring that both tech-savvy and traditional farmers can access and benefit from smart farming technologies. As agriculture continues to evolve, we strive to be part of the change – one that brings knowledge, efficiency, and sustainability to every farmer, no matter where they are.</p>
            <p>Through continuous research, user feedback, and innovation, AgroSentry aims to become more than just a tool – but a partner in building a smarter and more sustainable future for agriculture.</p>
          </div>
        </div>
      </section>

      <section className="core-values-section">
        <div className="container">
          <h2>Our Core Value</h2>
          <div className="core-values-grid">
            <div className="value-card">
              <img src={core1Image} alt="Innovation Icon" />
              <h3>Innovation</h3>
              <p>Constantly improving our tools with cutting-edge technology</p>
            </div>
            <div className="value-card">
              <img src={core2Image} alt="Empowerment Icon" />
              <h3>Empowerment</h3>
              <p>Supporting farmers with the knowledge and confidence to act</p>
            </div>
            <div className="value-card">
              <img src={core3Image} alt="Sustainability Icon" />
              <h3>Sustainability</h3>
              <p>Building systems that protect both crops and the planet</p>
            </div>
          </div>
        </div>
      </section>

      <section className="customer-review-section">
        <div className="container">
          <h2 className="customer-review-title">Customer Review</h2>
          <p className="customer-review-subtitle">Experience shared by those who’ve tried and trusted the platform</p>
          <div className="customer-review-images">
            <img src={customer1Image} alt="Customer 1 Review" />
            <img src={customer2Image} alt="Customer 2 Review" />
            <img src={customer3Image} alt="Customer 3 Review" />
            <img src={customer4Image} alt="Customer 4 Review" />
          </div>
        </div>
      </section>

      {/* Footer is part of the LandingPage component now if it was intended to be on all main pages */}
      {/* If footer is truly global, it would be in App.js or a Layout component */}
      {/* For now, assuming it's part of the content being added to this specific page */}
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
    </main>
  );
};

export default AboutUsPage;