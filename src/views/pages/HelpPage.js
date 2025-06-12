// frontend/src/views/pages/HelpPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

// Import all necessary images for Webpack
import helpHeroImage from '../../assets/images/gardening.png'; //
import computerIcon from '../../assets/images/computer.png'; //
import pictureIcon from '../../assets/images/picture.png'; // Corrected path
import searchIcon from '../../assets/images/search.png'; //
import fileUploadIcon from '../../assets/images/file-upload.png'; //
import goodFeedbackIcon from '../../assets/images/good-feedback.png'; //
import arrowIcon from '../../assets/images/arrow.png'; // Imported arrow icon for FAQ toggle

const HelpPage = () => {
  const [activeFaq, setActiveFaq] = useState(null); // State to manage active FAQ item
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [contactMessage, setContactMessage] = useState({ type: '', text: '' });

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setContactMessage({ type: 'success', text: 'Your message has been successfully submitted!' });
      setContactForm({ name: '', email: '', message: '' }); // Reset form
    } else {
      setContactMessage({ type: 'danger', text: 'Please fill in all fields.' });
    }
    setTimeout(() => setContactMessage({ type: '', text: '' }), 5000); // Clear message after 5 seconds
  };

  const faqs = [
    {
      question: "What is Agrosentry?",
      answer: "AgroSentry is a web-based platform that helps farmers identify pests and receive farming recommendations using AI-powered image analysis. Simply upload a photo of your crop, and the system will analyze it to detect any signs of pest infestations or issues. It’s designed to make farming smarter, faster, and more accessible."
    },
    {
      question: "How does pest detection work?",
      answer: "The pest detection system uses artificial intelligence and machine learning models trained on thousands of plant and pest images. When you upload a photo, the system analyzes visual patterns such as color, texture, and shape to detect possible pest infestations. Results are shown along with practical treatment recommendations."
    },
    {
      question: "Is Agrosentry free to use?",
      answer: "Yes, AgroSentry is currently free to use for all users. Our goal is to support smallholder farmers and agricultural communities by providing accessible and reliable farming tools."
    },
    {
      question: "Why the app doesn't detect anything from my photos?",
      answer: `There are several possible reasons:
        - The photo might be blurry or poorly lit, making it hard for the system to analyze
        - The pest or damage may not be visually distinct enough for AI detection
        - The system may not yet be trained on certain rare pests or plant types

        To improve accuracy:
        - Ensure the image is clear, well-lit, and focused on the affected area
        - Try uploading a different angle or closer shot of the problem`
    }
  ];

  return (
    <> {/* Using a React Fragment to wrap the content */}
      <main>
        <section className="help-hero" style={{ backgroundImage: `url(${helpHeroImage})`, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }}> {/* <-- PERUBAHAN DI SINI */}
          {/* The background image is now directly set via inline style to use the imported image */}
          <div className="hero-content-help">
              <h1>How Can We Help You?</h1>
          </div>
        </section>

        <section className="faq-section">
          <div className="container">
            <h2>FAQ</h2>
            {faqs.map((faq, index) => (
              <div className="faq-item" key={index}>
                <button
                  className={`faq-question ${activeFaq === index ? 'active' : ''}`}
                  onClick={() => toggleFaq(index)}
                >
                  {faq.question}
                  {/* Using img tag for arrow icon and controlling rotation with classes */}
                  <img src={arrowIcon} alt="Toggle" className={`faq-toggle-icon ${activeFaq === index ? 'up' : 'down'}`} />
                </button>
                <div className={`faq-answer ${activeFaq === index ? 'active' : ''}`}
                     style={{ maxHeight: activeFaq === index ? '500px' : '0' }}> {/* MaxHeight for smooth animation */}
                  {faq.answer.split('\n').map((paragraph, pIndex) => (
                      <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="how-it-works-section">
          <h2>User Guide</h2>
          <div className="steps-grid">
            <div className="step-item">
              <img src={computerIcon} alt="Open website" />
              <div className="step-number">01</div>
              <p>Open application or website</p>
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
        <section className="contact-support-section">
          <div className="container">
            <h2>Contact Support</h2>
            <p className="contact-description">Have questions or issues? Send us a message and we'll get back to you</p>
            {contactMessage.text && (
              <Alert variant={contactMessage.type} className="mb-3">
                {contactMessage.text}
              </Alert>
            )}
            <Form className="contact-form" onSubmit={handleContactSubmit}>
              <input type="text" id="contactName" name="name" placeholder="Name" value={contactForm.name} onChange={handleContactChange} required />
              <input type="email" id="contactEmail" name="email" placeholder="Email" value={contactForm.email} onChange={handleContactChange} required />
              {/* Changed input type="text" to textarea for multi-line message */}
              <textarea id="contactMessage" name="message" className="message-input" placeholder="Message" value={contactForm.message} onChange={handleContactChange} required rows="4"></textarea>
              <button type="submit" className="btn-sent">Sent</button>
            </Form>
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
              <li><Link to="/dashboard">Dashboard</Link></li>
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

export default HelpPage;