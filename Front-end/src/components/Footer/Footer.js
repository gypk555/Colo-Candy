import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: contact@mywebsite.com</p>
          <p>Phone: +123 456 7890</p>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Legal</h3>
          <a href="/terms-and-conditions">Terms and Conditions</a>
          <p>&copy; 2025 MyWebsite. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
