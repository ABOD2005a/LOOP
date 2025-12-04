import React, { useState } from "react";
import "./Footer.css";
import logoImage from "../../../assets/loopFooter.png";

function Footer() {
  const [toast, setToast] = useState({ show: false, message: "" });

  const closeToast = () => {
    setToast({ show: false, message: "" });
  };

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-col">
              <div className="footer-logo">
                <div className="logo-icon">
                  <img src={logoImage} alt="Loop logo" className="logo-image" />
                </div>
              </div>
              <p>
                Egypt's premier recycling platform. Making sustainability
                profitable for everyone.
              </p>
              <div className="social-links">
                <a
                  href="#"
                  aria-label="Facebook"
                  title="Facebook"
                  className="social-link"
                >
                  <i className="fab fa-facebook"></i>
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="#home">Home</a>
                </li>
                <li>
                  <a href="#calculator">Calculator</a>
                </li>
                <li>
                  <a href="#how">How it Works</a>
                </li>
                <li>
                  <a href="#impact">Our Impact</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Materials</h4>
              <ul>
                <li>
                  <a href="#">Metal Recycling</a>
                </li>
                <li>
                  <a href="#">Paper Recycling</a>
                </li>
                <li>
                  <a href="#">Plastic Recycling</a>
                </li>
                <li>
                  <a href="#">Pricing Guide</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Contact</h4>
              <ul>
                <li>
                  <i className="fas fa-phone"></i> 01234567890
                </li>
                <li>
                  <i className="fas fa-envelope"></i> info@karakib.com
                </li>
                <li>
                  <i className="fas fa-map-marker-alt"></i> Cairo, Egypt
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 Loop. All rights reserved.</p>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast.show && (
        <div className="toast" id="toast">
          <div className="toast-content">
            <p id="toastText">{toast.message}</p>
          </div>
          <button className="toast-close" id="toastClose" onClick={closeToast}>
            ×
          </button>
        </div>
      )}
    </>
  );
}

export default Footer;
