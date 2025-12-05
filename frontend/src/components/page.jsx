import React, { useState, useEffect, useRef } from 'react';

// CO2 savings per kg (approximate values)
const CO2_SAVINGS = {
  metal: 2.5,
  paper: 1.2,
  plastic: 1.8
};

// Water savings per kg (liters)
const WATER_SAVINGS = {
  metal: 40,
  paper: 15,
  plastic: 25
};

// Trees equivalent per kg
const TREES_EQUIV = {
  metal: 0.02,
  paper: 0.017,
  plastic: 0.015
};

const LoopRecyclingApp = () => {
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [pricePerKg, setPricePerKg] = useState(0);
  const [weight, setWeight] = useState('');
  const [multiItems, setMultiItems] = useState([]);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [calculationResults, setCalculationResults] = useState({
    total: 0,
    co2: 0,
    water: 0,
    trees: 0,
    showDetails: false
  });

  const totalAmountRef = useRef(null);

  useEffect(() => {
    animateStatsOnScroll();
    setupSmoothScroll();
  }, []);

  const animateValue = (element, start, end, duration) => {
    if (!element) return;
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        current = end;
        clearInterval(timer);
      }
      if (element) {
        element.textContent = Math.round(current);
      }
    }, 16);
  };

  const animateStatsOnScroll = () => {
    const statValues = document.querySelectorAll('.stat-value');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target);
          animateValue(entry.target, 0, target, 2000);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    statValues.forEach(stat => observer.observe(stat));
  };

  const setupSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  };

  const handleMaterialSelect = (material, price) => {
    setSelectedMaterial(material);
    setPricePerKg(price);
    if (weight) {
      calculatePrice(material, price, parseFloat(weight));
    }
  };

  const handleWeightChange = (value) => {
    setWeight(value);
    if (selectedMaterial && value) {
      calculatePrice(selectedMaterial, pricePerKg, parseFloat(value));
    }
  };

  const calculatePrice = (material, price, weightValue) => {
    if (!material) {
      showNotificationMessage('Please select a material type', 'warning');
      return;
    }
    
    if (!weightValue || weightValue <= 0) {
      showNotificationMessage('Please enter a valid weight', 'warning');
      return;
    }
    
    const total = weightValue * price;
    const co2SavedValue = weightValue * CO2_SAVINGS[material];
    const waterSavedValue = weightValue * WATER_SAVINGS[material];
    const treesEquivValue = weightValue * TREES_EQUIV[material];
    
    setCalculationResults({
      total,
      co2: co2SavedValue,
      water: waterSavedValue,
      trees: treesEquivValue,
      showDetails: true
    });

    if (totalAmountRef.current) {
      animateValue(totalAmountRef.current, 0, total, 500);
    }
  };

  const handleAddMore = () => {
    const weightValue = parseFloat(weight);
    
    if (!selectedMaterial || !weightValue || weightValue <= 0) {
      showNotificationMessage('Please complete the calculation first', 'warning');
      return;
    }
    
    const item = {
      material: selectedMaterial,
      weight: weightValue,
      pricePerKg: pricePerKg,
      total: weightValue * pricePerKg
    };
    
    setMultiItems([...multiItems, item]);
    resetCalculator();
    showNotificationMessage('Item added to calculation', 'success');
  };

  const handleClearAll = () => {
    if (multiItems.length === 0) return;
    
    if (window.confirm('Are you sure you want to clear all items?')) {
      setMultiItems([]);
      showNotificationMessage('All items cleared', 'success');
    }
  };

  const resetCalculator = () => {
    setSelectedMaterial(null);
    setPricePerKg(0);
    setWeight('');
    setCalculationResults({
      total: 0,
      co2: 0,
      water: 0,
      trees: 0,
      showDetails: false
    });
  };

  const showNotificationMessage = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const email = e.target.loginEmail.value;
    const password = e.target.loginPassword.value;
    
    if (email && password) {
      showNotificationMessage('Login successful! Welcome back.', 'success');
      e.target.reset();
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const name = e.target.signupName.value;
    const phone = e.target.signupPhone.value;
    const email = e.target.signupEmail.value;
    const password = e.target.signupPassword.value;
    const confirm = e.target.signupConfirm.value;
    const city = e.target.signupCity.value;
    const agreeTerms = e.target.agreeTerms.checked;
    
    if (phone.length !== 11 || !/^\d+$/.test(phone)) {
      showNotificationMessage('Please enter a valid 11-digit phone number', 'warning');
      return;
    }
    
    if (password !== confirm) {
      showNotificationMessage('Passwords do not match', 'error');
      return;
    }
    
    if (!agreeTerms) {
      showNotificationMessage('Please agree to the Terms & Conditions', 'warning');
      return;
    }
    
    if (name && phone && email && password && city) {
      showNotificationMessage('Account created successfully! Welcome to Loop.', 'success');
      e.target.reset();
      setTimeout(() => {
        setShowLoginForm(true);
      }, 2000);
    }
  };

  const materialNames = {
    metal: 'Metal',
    paper: 'Paper',
    plastic: 'Plastic'
  };

  const materialIcons = {
    metal: 'fa-toolbox',
    paper: 'fa-newspaper',
    plastic: 'fa-bottle-water'
  };

  const materialGradients = {
    metal: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    paper: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    plastic: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
  };

  const grandTotal = multiItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero__background">
          <div className="hero__shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        <div className="hero__content">
          <div className="hero__badge">
            <span>Egypt's Leading Recycling Platform</span>
          </div>
          <h1 className="hero__title">
            Transform Your <span className="gradient-text">Recyclables</span><br/>
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
            <div className="hero__stat">
              <div className="stat-value" data-target="50000">0</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="hero__stat">
              <div className="stat-value" data-target="500">0</div>
              <div className="stat-label">Tons Recycled</div>
            </div>
            <div className="hero__stat">
              <div className="stat-value" data-target="2000000">0</div>
              <div className="stat-label">EGP Distributed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="features__grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <h3>Instant Payment</h3>
              <p>Get paid immediately in cash or direct bank transfer</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-halved"></i>
              </div>
              <h3>Secure & Trusted</h3>
              <p>Licensed and certified by Egyptian authorities</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-truck"></i>
              </div>
              <h3>Free Pickup</h3>
              <p>Schedule free collection from your doorstep</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Best Rates</h3>
              <p>Competitive prices that beat the market average</p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="calculator">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Instant Calculator</span>
            <h2 className="section-title">Calculate Your Earnings</h2>
            <p className="section-description">See how much money you can make from your recyclables</p>
          </div>

          <div className="calculator__wrapper">
            {/* Material Selection */}
            <div className="calculator__materials">
              <div className="materials-header">
                <h3>Select Material</h3>
                <span className="material-count" id="materialCount">Choose one</span>
              </div>
              
              <div className="material-grid">
                <div 
                  className={`material-card ${selectedMaterial === 'metal' ? 'active' : ''}`}
                  data-material="metal" 
                  data-price="15"
                  onClick={() => handleMaterialSelect('metal', 15)}
                >
                  <div className="material-icon metal">
                    <i className="fas fa-toolbox"></i>
                  </div>
                  <div className="material-content">
                    <h4>Metal</h4>
                    <div className="material-price">
                      <span className="price-value">15</span>
                      <span className="price-unit">EGP/kg</span>
                    </div>
                    <div className="material-tags">
                      <span className="tag">High Value</span>
                      <span className="tag">Premium</span>
                    </div>
                  </div>
                  <div className="material-check">
                    <i className="fas fa-check"></i>
                  </div>
                </div>

                <div 
                  className={`material-card ${selectedMaterial === 'paper' ? 'active' : ''}`}
                  data-material="paper" 
                  data-price="3"
                  onClick={() => handleMaterialSelect('paper', 3)}
                >
                  <div className="material-icon paper">
                    <i className="fas fa-newspaper"></i>
                  </div>
                  <div className="material-content">
                    <h4>Paper</h4>
                    <div className="material-price">
                      <span className="price-value">3</span>
                      <span className="price-unit">EGP/kg</span>
                    </div>
                    <div className="material-tags">
                      <span className="tag">Eco-Friendly</span>
                      <span className="tag">Common</span>
                    </div>
                  </div>
                  <div className="material-check">
                    <i className="fas fa-check"></i>
                  </div>
                </div>

                <div 
                  className={`material-card ${selectedMaterial === 'plastic' ? 'active' : ''}`}
                  data-material="plastic" 
                  data-price="8"
                  onClick={() => handleMaterialSelect('plastic', 8)}
                >
                  <div className="material-icon plastic">
                    <i className="fas fa-bottle-water"></i>
                  </div>
                  <div className="material-content">
                    <h4>Plastic</h4>
                    <div className="material-price">
                      <span className="price-value">8</span>
                      <span className="price-unit">EGP/kg</span>
                    </div>
                    <div className="material-tags">
                      <span className="tag">Popular</span>
                      <span className="tag">Easy</span>
                    </div>
                  </div>
                  <div className="material-check">
                    <i className="fas fa-check"></i>
                  </div>
                </div>
              </div>

              <div className="weight-input">
                <label>Enter Weight (kg)</label>
                <div className="input-wrapper">
                  <input 
                    type="number" 
                    id="weight" 
                    placeholder="0.0" 
                    min="0" 
                    step="0.1"
                    value={weight}
                    onChange={(e) => handleWeightChange(e.target.value)}
                  />
                  <span className="input-icon">kg</span>
                </div>
                <div className="quick-weights">
                  {[5, 10, 25, 50, 100].map(w => (
                    <button 
                      key={w}
                      className="quick-btn" 
                      data-weight={w}
                      onClick={() => handleWeightChange(w.toString())}
                    >
                      {w} kg
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calculator__result">
              <div className="result-card">
                <div className="result-header">
                  <div className="result-icon">
                    <i className="fas fa-money-bill-wave"></i>
                  </div>
                  <span>Your Earnings</span>
                </div>
                
                <div className="result-amount">
                  <span className="currency">EGP</span>
                  <span className="amount" id="totalAmount" ref={totalAmountRef}>{Math.round(calculationResults.total)}</span>
                </div>

                <div className={`result-details ${calculationResults.showDetails ? 'show' : ''}`} id="resultDetails">
                  <div className="detail-item">
                    <span className="detail-label">Material</span>
                    <span className="detail-value" id="materialName">{selectedMaterial ? materialNames[selectedMaterial] : '-'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Weight</span>
                    <span className="detail-value" id="materialWeight">{weight || 0} kg</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Rate</span>
                    <span className="detail-value" id="pricePerKg">{pricePerKg} EGP/kg</span>
                  </div>
                  <div className="detail-item highlight">
                    <span className="detail-label">CO₂ Saved</span>
                    <span className="detail-value" id="co2Saved">{calculationResults.co2.toFixed(2)} kg</span>
                  </div>
                </div>

                <div className="result-actions">
                  <button className="btn btn-outline btn-block" id="addMoreBtn" onClick={handleAddMore}>
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
                      <span className="impact-value" id="treesEquiv">{calculationResults.trees.toFixed(1)}</span>
                      <span className="impact-label">Trees Saved</span>
                    </div>
                  </div>
                  <div className="impact-stat">
                    <i className="fas fa-droplet"></i>
                    <div>
                      <span className="impact-value" id="waterSaved">{calculationResults.water.toFixed(0)}L</span>
                      <span className="impact-label">Water Saved</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Multi Item Summary */}
          {multiItems.length > 0 && (
            <div className="multi-summary show" id="multiSummary">
              <div className="summary-header">
                <h3>Transaction Summary</h3>
                <button className="btn-text" id="clearAll" onClick={handleClearAll}>
                  <i className="fas fa-trash"></i> Clear All
                </button>
              </div>
              <div className="summary-items" id="summaryItems">
                {multiItems.map((item, index) => (
                  <div key={index} className="summary-item">
                    <div className="summary-item__info">
                      <div className="summary-item__icon" style={{ background: materialGradients[item.material] }}>
                        <i className={`fas ${materialIcons[item.material]}`}></i>
                      </div>
                      <div className="summary-item__content">
                        <h4>{materialNames[item.material]}</h4>
                        <p>{item.weight} kg × {item.pricePerKg} EGP/kg</p>
                      </div>
                    </div>
                    <div className="summary-item__price">{item.total.toFixed(2)} EGP</div>
                  </div>
                ))}
              </div>
              <div className="summary-total">
                <span>Grand Total</span>
                <span className="total-value" id="grandTotal">{grandTotal.toFixed(2)} EGP</span>
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
            <p className="section-description">Four easy steps to turn your recyclables into cash</p>
          </div>

          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">
                <i className="fas fa-box-open"></i>
              </div>
              <h3>Collect & Sort</h3>
              <p>Gather your metal, paper, or plastic recyclables and separate them by type</p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">
                <i className="fas fa-calculator"></i>
              </div>
              <h3>Calculate Value</h3>
              <p>Use our instant calculator to see exactly how much you'll earn</p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">
                <i className="fas fa-truck-fast"></i>
              </div>
              <h3>Schedule Pickup</h3>
              <p>Choose delivery to our branch or free pickup from your location</p>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <div className="step-icon">
                <i className="fas fa-money-bill-wave"></i>
              </div>
              <h3>Get Paid Instantly</h3>
              <p>Receive immediate payment via cash, bank transfer, or mobile wallet</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section id="impact" className="impact-section">
        <div className="container">
          <div className="impact-grid">
            <div className="impact-content">
              <span className="section-badge light">Our Impact</span>
              <h2>Making Egypt Greener, Together</h2>
              <p>Every kilogram you recycle makes a difference. Join our community in creating a sustainable future for Egypt.</p>
              
              <div className="impact-metrics">
                <div className="metric">
                  <div className="metric-icon">
                    <i className="fas fa-leaf"></i>
                  </div>
                  <div className="metric-content">
                    <h4>500+ Tons</h4>
                    <p>Recycled This Year</p>
                  </div>
                </div>
                <div className="metric">
                  <div className="metric-icon">
                    <i className="fas fa-tree"></i>
                  </div>
                  <div className="metric-content">
                    <h4>8,500 Trees</h4>
                    <p>Equivalent Saved</p>
                  </div>
                </div>
                <div className="metric">
                  <div className="metric-icon">
                    <i className="fas fa-cloud"></i>
                  </div>
                  <div className="metric-content">
                    <h4>1,200 Tons</h4>
                    <p>CO₂ Emissions Reduced</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="impact-visual">
              <div className="circular-progress">
                <svg viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" className="progress-bg"></circle>
                  <circle cx="100" cy="100" r="90" className="progress-bar"></circle>
                </svg>
                <div className="progress-content">
                  <div className="progress-value">75%</div>
                  <div className="progress-label">Recycling Goal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoopRecyclingApp;