import React, { useState, useEffect, useRef } from "react";
import "./home.css";
import Navbar from "./Header_Footer/Navbar/page";
import Footer from "./Header_Footer/Footer/page";
import NavbarAfter from "./Header_Footer/NavbarAfter/page";

const CO2_SAVINGS = {
  metal: 2.5,
  paper: 1.2,
  plastic: 1.8,
};

const WATER_SAVINGS = {
  metal: 40,
  paper: 15,
  plastic: 25,
};

const TREES_EQUIV = {
  metal: 0.02,
  paper: 0.017,
  plastic: 0.015,
};


function AnimatedCounter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

function Notification({ message, type, show, onHide }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onHide, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  return (
    <div className={`notification ${type} ${show ? "show" : ""}`}>
      <i
        className={`fas ${
          type === "success"
            ? "fa-check-circle"
            : type === "error"
            ? "fa-times-circle"
            : "fa-exclamation-circle"
        }`}
      ></i>
      <span>{message}</span>
    </div>
  );
}

const steps = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M16 16h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2" />
        <rect width="12" height="12" x="4" y="8" rx="2" />
      </svg>
    ),
    title: "Collect Recyclables",
    description:
      "Gather your metal, paper, and plastic recyclables at home or work.",
    step: "01",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" />
        <circle cx="7" cy="18" r="2" />
      </svg>
    ),
    title: "Schedule Pickup",
    description:
      "Book a free pickup through our app. We come to your doorstep.",
    step: "02",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
    title: "Get Paid Instantly",
    description:
      "Receive immediate payment via mobile wallet or cash on pickup.",
    step: "03",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
    title: "Save the Planet",
    description:
      "Track your environmental impact and see how you're making a difference.",
    step: "04",
  },
];

const buttons = [
  {
    text: "Schedule Pickup",
    href: "/booking.html",
    type: "primary",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    ),
  },
  {
    text: "Learn More",
    href: "/about.html",
    type: "outline",
    icon: null,
  },
];

const badges = [
  {
    value: "50K+",
    label: "Active Collectors",
  },
  {
    value: "2M+",
    label: "Items Recycled",
  },
  {
    value: "100%",
    label: "Free to Join",
  },
];

export default function Home() {
 
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });


  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }));
  };

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      <Notification {...notification} onHide={hideNotification} />
  

      <section className="hero">
        <div className="hero__background" />
        <div className="hero__shapes"/>


        <div className="hero__content">
          <div className="hero__badge">
            <span>Egypt's Leading Recycling Platform</span>
          </div>

          <h1 className="hero__title gradient-text">
            Transform Your <span className="">Recyclables</span>
            <br />
            Into Real <span className="gradient-text">Money</span>
          </h1>

          <p className="hero__description">
            Join thousands of Egyptians making money while saving the planet.
            Get instant cash for metal, paper, and plastic recyclables.
          </p>

          <div className="hero__actions">
            <a href="#cta" className="btn btn-primary">
              <i className="fas fa-calculator"></i>
              <span>Start Earning Now</span>
            </a>
            <a href="#how-it-works" className="btn btn-secondary">
              <i className="fas fa-info-circle"></i>
              <span>See How it Works</span>
            </a>
          </div>

          <div className="hero__stats">
            {[
              { value: 50000, label: "Active Users" },
              { value: 500, label: "Tons Recycled" },
              { value: 2000000, label: "EGP Distributed" },
            ].map((stat, i) => (
              <div key={i} className="hero__stat">
                <span className="stat-value">
                  <AnimatedCounter end={stat.value} />
                </span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works">
        <div className="bg-decoration-top"></div>
        <div className="bg-decoration-bottom"></div>

        <div className="container">
          <div className="section-header">
            <span className="section-badge">Simple Process</span>
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">
              Turn your recyclables into cash in just a few simple steps. We
              make sustainable living rewarding.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.step}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="connector-line"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      <section id="impact" className="impact-section">
        <div className="container">
          <div className="impact-grid">
            <div className="impact-content">
              <span className="section-badge light">Our Impact</span>
              <h2>Making Egypt Greener, Together</h2>
              <p>
                Every kilogram you recycle makes a difference. Join our
                community in creating a sustainable future for Egypt.
              </p>

              <div className="impact-metrics">
                {[
                  {
                    icon: "fa-leaf",
                    value: "500+ Tons",
                    label: "Recycled This Year",
                  },
                  {
                    icon: "fa-tree",
                    value: "8,500 Trees",
                    label: "Equivalent Saved",
                  },
                  {
                    icon: "fa-cloud",
                    value: "1,200 Tons",
                    label: "CO₂ Emissions Reduced",
                  },
                ].map((metric, i) => (
                  <div key={i} className="metric">
                    <div className="metric-icon">
                      <i className={`fas ${metric.icon}`}></i>
                    </div>
                    <div className="metric-content">
                      <h4>{metric.value}</h4>
                      <p>{metric.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="impact-visual">
              <div className="circular-progress">
                <svg viewBox="0 0 200 200">
                  <circle className="progress-bg" cx="100" cy="100" r="90" />
                  <circle className="progress-bar" cx="100" cy="100" r="90" />
                </svg>
                <div className="progress-content">
                  <span className="progress-value">75%</span>
                  <span className="progress-label">Recycling Goal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id= "cta"className="cta-section">
        <div className="cta-bg-decoration"></div>

        <div className="container">
          <div className="glass-card">
            <div className="cta-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
            </div>

            <h2 className="cta-title">Ready to Start Collecting?</h2>

            <p className="cta-description">
              Join thousands of collectors who are turning their recyclables
              into cash. Schedule your first pickup today and start making a
              difference.
            </p>

            <div className="cta-buttons">
              {buttons.map((button, index) => (
                <a
                  key={index}
                  href={button.href}
                  className={`btn btn-${button.type}`}
                >
                  {button.text}
                  {button.icon}
                </a>
              ))}
            </div>

            <div className="trust-badges">
              {badges.map((badge, index) => (
                <React.Fragment key={index}>
                  <div className="badge-item">
                    <div className="badge-value">{badge.value}</div>
                    <div className="badge-label">{badge.label}</div>
                  </div>
                  {index < badges.length - 1 && (
                    <div className="badge-divider"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
