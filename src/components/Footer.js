// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo-text">YourShop</span>
        </div>
        <div className="footer-links">
          <Link to="/about" className="neon-link">
            About
          </Link>
          <Link to="/contact" className="neon-link">
            Contact
          </Link>
          <Link to="/privacy" className="neon-link">
            Privacy Policy
          </Link>
        </div>
        <div className="social-links">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="neon-link"
          >
            Twitter
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="neon-link"
          >
            Instagram
          </a>
        </div>
        <p className="footer-text">
          © {new Date().getFullYear()} YourShop. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;