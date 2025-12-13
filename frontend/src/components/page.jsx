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

const materialData = [
  {
    id: "metal",
    name: "Metal",
    price: 15,
    icon: "fa-toolbox",
    tags: ["High Value", "Premium"],
    iconClass: "metal",
  },
  {
    id: "paper",
    name: "Paper",
    price: 3,
    icon: "fa-newspaper",
    tags: ["Eco-Friendly", "Common"],
    iconClass: "paper",
  },
  {
    id: "plastic",
    name: "Plastic",
    price: 8,
    icon: "fa-bottle-water",
    tags: ["Popular", "Easy"],
    iconClass: "plastic",
  },
];

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

export default function Home() {
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [weight, setWeight] = useState("");
  const [multiItems, setMultiItems] = useState([]);
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }));
  };

  const calculatePrice = () => {
    if (!selectedMaterial) {
      showNotification("Please select a material type", "warning");
      return;
    }

    const weightNum = parseFloat(weight);
    if (!weightNum || weightNum <= 0) {
      showNotification("Please enter a valid weight", "warning");
      return;
    }

    const material = materialData.find((m) => m.id === selectedMaterial);
    const total = weightNum * material.price;
    setCalculatedTotal(total);
  };

  useEffect(() => {
    if (selectedMaterial && weight) {
      calculatePrice();
    }
  }, [selectedMaterial, weight]);

  const addItem = () => {
    const weightNum = parseFloat(weight);
    if (!selectedMaterial || !weightNum || weightNum <= 0) {
      showNotification("Please complete the calculation first", "warning");
      return;
    }

    const material = materialData.find((m) => m.id === selectedMaterial);
    const item = {
      material: selectedMaterial,
      materialName: material.name,
      weight: weightNum,
      pricePerKg: material.price,
      total: weightNum * material.price,
      icon: material.icon,
      iconClass: material.iconClass,
    };

    setMultiItems([...multiItems, item]);
    resetCalculator();
    showNotification("Item added to calculation", "success");
  };

  const resetCalculator = () => {
    setSelectedMaterial(null);
    setWeight("");
    setCalculatedTotal(0);
  };

  const clearAll = () => {
    if (multiItems.length === 0) return;
    if (window.confirm("Are you sure you want to clear all items?")) {
      setMultiItems([]);
      showNotification("All items cleared", "success");
    }
  };

  const grandTotal = multiItems.reduce((sum, item) => sum + item.total, 0);

  const material = selectedMaterial
    ? materialData.find((m) => m.id === selectedMaterial)
    : null;
  const weightNum = parseFloat(weight) || 0;
  const co2SavedValue = material ? weightNum * CO2_SAVINGS[material.id] : 0;
  const waterSavedValue = material ? weightNum * WATER_SAVINGS[material.id] : 0;
  const treesEquivValue = material ? weightNum * TREES_EQUIV[material.id] : 0;

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      <Notification {...notification} onHide={hideNotification} />
      <NavbarAfter/>
{/* <Navbar/> */}
      <section className="hero">
        <div className="hero__background"/>
        <div className="hero__shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>

        <div className="hero__content">
          <div className="hero__badge">
            <span>Egypt's Leading Recycling Platform</span>
          </div>

          <h1 className="hero__title">
            Transform Your <span className="gradient-text">Recyclables</span>
            <br />
            Into Real <span className="gradient-text">Money</span>
          </h1>

          <p className="hero__description">
            Join thousands of Egyptians making money while saving the planet.
            Get instant cash for metal, paper, and plastic recyclables.
          </p>

          <div className="hero__actions">
            <a href="#calculator" className="btn btn-primary">
              <i className="fas fa-calculator"></i>
              <span>Start Earning Now</span>
            </a>
            <a href="#how" className="btn btn-secondary">
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

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="features__grid">
            {[
              {
                icon: "fa-bolt",
                title: "Instant Payment",
                desc: "Get paid immediately in cash or direct bank transfer",
              },
              {
                icon: "fa-shield-halved",
                title: "Secure & Trusted",
                desc: "Licensed and certified by Egyptian authorities",
              },
              {
                icon: "fa-truck",
                title: "Free Pickup",
                desc: "Schedule free collection from your doorstep",
              },
              {
                icon: "fa-chart-line",
                title: "Best Rates",
                desc: "Competitive prices that beat the market average",
              },
            ].map((feature, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">
                  <i className={`fas ${feature.icon}`}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="calculator">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Instant Calculator</span>
            <h2 className="section-title">Calculate Your Earnings</h2>
            <p className="section-description">
              See how much money you can make from your recyclables
            </p>
          </div>

          <div className="calculator__wrapper">
            {/* Material Selection */}
            <div className="calculator__materials">
              <div className="materials-header">
                <h3>Select Material</h3>
                <span className="material-count">
                  {selectedMaterial ? "1 selected" : "Choose one"}
                </span>
              </div>

              <div className="material-grid">
                {materialData.map((mat) => (
                  <div
                    key={mat.id}
                    onClick={() => setSelectedMaterial(mat.id)}
                    className={`material-card ${
                      selectedMaterial === mat.id ? "active" : ""
                    }`}
                  >
                    <div className={`material-icon ${mat.iconClass}`}>
                      <i className={`fas ${mat.icon}`}></i>
                    </div>
                    <div className="material-content">
                      <h4>{mat.name}</h4>
                      <div className="material-price">
                        <span className="price-value">{mat.price}</span>
                        <span className="price-unit">EGP/kg</span>
                      </div>
                      <div className="material-tags">
                        {mat.tags.map((tag, i) => (
                          <span key={i} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {selectedMaterial === mat.id && (
                      <div className="material-check">
                        <i className="fas fa-check"></i>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="weight-input">
                <label>Enter Weight (kg)</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0.0"
                    min="0"
                    step="0.1"
                  />
                  <span className="input-icon">kg</span>
                </div>
                <div className="quick-weights">
                  {[5, 10, 25, 50, 100].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeight(w.toString())}
                      className="quick-btn"
                    >
                      {w} kg
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="calculator__result">
              <div className="result-card">
                <div className="result-header">
                  <div className="result-icon">
                    <i className="fas fa-money-bill-wave"></i>
                  </div>
                  <span>Your Earnings</span>
                </div>

                <div className="result-amount">
                  <span className="currency">Egyptian Pound</span>
                  <span className="amount">{Math.round(calculatedTotal)}</span>
                </div>

                {material && weight && (
                  <div className="result-details show">
                    <div className="detail-item">
                      <span className="detail-label">Material</span>
                      <span className="detail-value">{material.name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Weight</span>
                      <span className="detail-value">{weightNum} kg</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Rate</span>
                      <span className="detail-value">
                        {material.price} EGP/kg
                      </span>
                    </div>
                    <div className="detail-item highlight">
                      <span className="detail-label">CO₂ Saved</span>
                      <span className="detail-value">
                        {co2SavedValue.toFixed(2)} kg
                      </span>
                    </div>
                  </div>
                )}

                <div className="result-actions">
                  <button
                    onClick={addItem}
                    className="btn btn-primary btn-block"
                  >
                    <i className="fas fa-plus"></i>
                    <span>Add Another Item</span>
                  </button>
                </div>
              </div>

              {/* Environmental Impact */}
              <div className="impact-card">
                <div className="impact-header">
                  <i className="fas fa-leaf"></i>
                  <h4>Environmental Impact</h4>
                </div>
                <div className="impact-stats">
                  <div className="impact-stat">
                    <i className="fas fa-tree"></i>
                    <div>
                      <span className="impact-value">
                        {treesEquivValue.toFixed(1)}
                      </span>
                      <span className="impact-label">Trees Saved</span>
                    </div>
                  </div>
                  <div className="impact-stat">
                    <i className="fas fa-droplet"></i>
                    <div>
                      <span className="impact-value">
                        {waterSavedValue.toFixed(0)}L
                      </span>
                      <span className="impact-label">Water Saved</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Multi Summary */}
          {multiItems.length > 0 && (
            <div className="multi-summary show">
              <div className="summary-header">
                <h3>Transaction Summary</h3>
                <button onClick={clearAll} className="btn-text">
                  <i className="fas fa-trash"></i> Clear All
                </button>
              </div>
              <div className="summary-items">
                {multiItems.map((item, i) => (
                  <div key={i} className="summary-item">
                    <div className="summary-item__info">
                      <div
                        className={`summary-item__icon material-icon ${item.iconClass}`}
                      >
                        <i className={`fas ${item.icon}`}></i>
                      </div>
                      <div className="summary-item__content">
                        <h4>{item.materialName}</h4>
                        <p>
                          {item.weight} kg × {item.pricePerKg} EGP/kg
                        </p>
                      </div>
                    </div>
                    <div className="summary-item__price">
                      {item.total.toFixed(2)} EGP
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary-total">
                <span>Grand Total</span>
                <span>{grandTotal.toFixed(2)} EGP</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Simple Process</span>
            <h2 className="section-title">How Loop Works</h2>
            <p className="section-description">
              Four easy steps to turn your recyclables into cash
            </p>
          </div>

          <div className="steps-container">
            {[
              {
                num: "01",
                icon: "fa-box-open",
                title: "Collect & Sort",
                desc: "Gather your metal, paper, or plastic recyclables and separate them by type",
              },
              {
                num: "02",
                icon: "fa-calculator",
                title: "Calculate Value",
                desc: "Use our instant calculator to see exactly how much you'll earn",
              },
              {
                num: "03",
                icon: "fa-truck-fast",
                title: "Schedule Pickup",
                desc: "Choose delivery to our branch or free pickup from your location",
              },
              {
                num: "04",
                icon: "fa-money-bill-wave",
                title: "Get Paid Instantly",
                desc: "Receive immediate payment via cash, bank transfer, or mobile wallet",
              },
            ].map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-number">{step.num}</div>
                <div className="step-icon">
                  <i className={`fas ${step.icon}`}></i>
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
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
      <Footer/>
    </>
  );
}
