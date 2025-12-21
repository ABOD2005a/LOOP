/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, Send, Contact } from "lucide-react";
import "./Contact.css";
import NavbarAfter from "../../Header_Footer/NavbarAfter/page";
import Navbar from "../../Header_Footer/Navbar/page";

export default function contact() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      // طباعة كل القيم الموجودة في localStorage
      console.log("=== Contact Page - Checking Auth Status ===");
      console.log("localStorage authToken:", localStorage.getItem("authToken"));
      console.log("localStorage userData:", localStorage.getItem("userData"));
      console.log(
        "localStorage isLoggedIn:",
        localStorage.getItem("isLoggedIn")
      );
      console.log("localStorage token:", localStorage.getItem("token"));
      console.log("localStorage user:", localStorage.getItem("user"));
      console.log(
        "sessionStorage authToken:",
        sessionStorage.getItem("authToken")
      );
      console.log("All localStorage keys:", Object.keys(localStorage));

      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");
      const isAuth = localStorage.getItem("isLoggedIn") === "true";
      const tokenAlt = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      const loggedIn = !!(token || userData || isAuth || tokenAlt || user);

      console.log("Final isLoggedIn:", loggedIn);
      setIsLoggedIn(loggedIn);
    };

    checkAuthStatus();

    const handleStorageChange = () => {
      console.log("Storage changed in Contact page, rechecking auth...");
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    const values = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    if (!values.name) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (values.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters";
      isValid = false;
    }

    if (!values.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    } else if (values.email.length > 255) {
      newErrors.email = "Email must be less than 255 characters";
      isValid = false;
    }

    if (!values.subject) {
      newErrors.subject = "Subject is required";
      isValid = false;
    } else if (values.subject.length > 200) {
      newErrors.subject = "Subject must be less than 200 characters";
      isValid = false;
    }

    if (!values.message) {
      newErrors.message = "Message is required";
      isValid = false;
    } else if (values.message.length > 2000) {
      newErrors.message = "Message must be less than 2000 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    setIsSubmitting(false);
  };

  return (
    <div>
      <main>
        {isLoggedIn ? <NavbarAfter /> : <Navbar />}

        <section className="hero">
          <div className="container">
            <h1>
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p>
              Have questions about our recycling program? Want to become a
              partner? We'd love to hear from you. Reach out and let's make
              sustainability happen together.
            </p>
          </div>
        </section>

        <section className="contact-info">
          <div className="container">
            <div className="info-grid">
              <div className="info-card">
                <div className="info-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <h3>Email Us</h3>
                <div className="info-value">Loop@gmail.com</div>
                <div className="info-description">
                  We'll respond within 24 hours
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <h3>Call Us</h3>
                <div className="info-value">01234567890</div>
                <div className="info-description">Mon-Fri, 9am-6pm EST</div>
              </div>
              <div className="info-card">
                <div className="info-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3>Visit Us</h3>
                <div className="info-value">Dokki, Giza Governorate</div>
                <div className="info-description">Our headquarters</div>
              </div>
              <div className="info-card">
                <div className="info-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3>Business Hours</h3>
                <div className="info-value">Monday - Friday</div>
                <div className="info-description">9:00 AM - 6:00 PM EST</div>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-form-section">
          <div className="container">
            <div className="form-container">
              <div className="form-card">
                <div className="form-header">
                  <h2>Send Us a Message</h2>
                  <p>
                    Fill out the form below and we'll get back to you as soon as
                    possible.
                  </p>
                </div>

                <div id="contactForm">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Amr mohamed"
                        className={errors.name ? "error" : ""}
                      />
                      {errors.name && (
                        <div className="error-message">{errors.name}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="amr332763@gmail.com"
                        className={errors.email ? "error" : ""}
                      />
                      {errors.email && (
                        <div className="error-message">{errors.email}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="How can we help?"
                      className={errors.subject ? "error" : ""}
                    />
                    {errors.subject && (
                      <div className="error-message">{errors.subject}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your inquiry..."
                      className={errors.message ? "error" : ""}
                    />
                    {errors.message && (
                      <div className="error-message">{errors.message}</div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="submit-btn"
                    id="submitBtn"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m22 2-7 20-4-9-9-4Z" />
                      <path d="M22 2 11 13" />
                    </svg>
                    <span id="btnText">
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <div className="container">
            <h2>Looking for Quick Answers?</h2>
            <p>
              Check out our frequently asked questions or learn more about how
              Collect & Earn works.
            </p>
            <div className="faq-buttons">
              <a href="/about.html" className="btn btn-primary">
                Learn About Us
              </a>
              <a href="/#how-it-works" className="btn btn-outline">
                How It Works
              </a>
            </div>
          </div>
        </section>
      </main>

      {showToast && (
        <div className="toast show" id="toast">
          <div className="toast-title">Message Sent!</div>
          <div className="toast-description">
            Thank you for reaching out. We'll get back to you soon.
          </div>
        </div>
      )}
    </div>
  );
}
