import React, { useState, useEffect, useRef } from 'react';

const CO2_SAVINGS = {
  metal: 2.5,
  paper: 1.2,
  plastic: 1.8
};

const WATER_SAVINGS = {
  metal: 40,
  paper: 15,
  plastic: 25
};

const TREES_EQUIV = {
  metal: 0.02,
  paper: 0.017,
  plastic: 0.015
};

const materialData = [
  {
    id: 'metal',
    name: 'Metal',
    price: 15,
    icon: 'fa-toolbox',
    tags: ['High Value', 'Premium'],
    gradient: 'from-slate-500 to-slate-600'
  },
  {
    id: 'paper',
    name: 'Paper',
    price: 3,
    icon: 'fa-newspaper',
    tags: ['Eco-Friendly', 'Common'],
    gradient: 'from-amber-500 to-amber-600'
  },
  {
    id: 'plastic',
    name: 'Plastic',
    price: 8,
    icon: 'fa-bottle-water',
    tags: ['Popular', 'Easy'],
    gradient: 'from-blue-500 to-blue-600'
  }
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

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    warning: 'fa-exclamation-circle'
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500'
  };

  return (
    <div className={`fixed top-6 right-6 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 transition-all duration-300 z-50 ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <i className={`fas ${icons[type]} text-xl`}></i>
      <span className="font-medium">{message}</span>
    </div>
  );
}

export default function LoopRecyclingApp() {
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [weight, setWeight] = useState('');
  const [multiItems, setMultiItems] = useState([]);
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  const calculatePrice = () => {
    if (!selectedMaterial) {
      showNotification('Please select a material type', 'warning');
      return;
    }

    const weightNum = parseFloat(weight);
    if (!weightNum || weightNum <= 0) {
      showNotification('Please enter a valid weight', 'warning');
      return;
    }

    const material = materialData.find(m => m.id === selectedMaterial);
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
      showNotification('Please complete the calculation first', 'warning');
      return;
    }

    const material = materialData.find(m => m.id === selectedMaterial);
    const item = {
      material: selectedMaterial,
      materialName: material.name,
      weight: weightNum,
      pricePerKg: material.price,
      total: weightNum * material.price,
      icon: material.icon,
      gradient: material.gradient
    };

    setMultiItems([...multiItems, item]);
    resetCalculator();
    showNotification('Item added to calculation', 'success');
  };

  const resetCalculator = () => {
    setSelectedMaterial(null);
    setWeight('');
    setCalculatedTotal(0);
  };

  const clearAll = () => {
    if (multiItems.length === 0) return;
    if (window.confirm('Are you sure you want to clear all items?')) {
      setMultiItems([]);
      showNotification('All items cleared', 'success');
    }
  };

  const grandTotal = multiItems.reduce((sum, item) => sum + item.total, 0);

  const material = selectedMaterial ? materialData.find(m => m.id === selectedMaterial) : null;
  const weightNum = parseFloat(weight) || 0;
  const co2SavedValue = material ? weightNum * CO2_SAVINGS[material.id] : 0;
  const waterSavedValue = material ? weightNum * WATER_SAVINGS[material.id] : 0;
  const treesEquivValue = material ? weightNum * TREES_EQUIV[material.id] : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 font-['Plus_Jakarta_Sans']">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      
      <Notification {...notification} onHide={hideNotification} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-8 animate-fade-in">
            <span className="text-sm font-semibold text-slate-700">Egypt's Leading Recycling Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Transform Your <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Recyclables</span><br/>
            Into Real <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Money</span>
          </h1>

          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            Join thousands of Egyptians making money while saving the planet. 
            Get instant cash for metal, paper, and plastic recyclables.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <a href="#calculator" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2">
              <i className="fas fa-calculator"></i>
              <span>Start Earning Now</span>
            </a>
            <a href="#how" className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2">
              <i className="fas fa-info-circle"></i>
              <span>See How it Works</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { value: 50000, label: 'Active Users' },
              { value: 500, label: 'Tons Recycled' },
              { value: 2000000, label: 'EGP Distributed' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  <AnimatedCounter end={stat.value} />
                </div>
                <div className="text-slate-600 font-medium mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'fa-bolt', title: 'Instant Payment', desc: 'Get paid immediately in cash or direct bank transfer' },
              { icon: 'fa-shield-halved', title: 'Secure & Trusted', desc: 'Licensed and certified by Egyptian authorities' },
              { icon: 'fa-truck', title: 'Free Pickup', desc: 'Schedule free collection from your doorstep' },
              { icon: 'fa-chart-line', title: 'Best Rates', desc: 'Competitive prices that beat the market average' }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
                  <i className={`fas ${feature.icon}`}></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm mb-4">Instant Calculator</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Calculate Your Earnings</h2>
            <p className="text-xl text-slate-600">See how much money you can make from your recyclables</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Material Selection */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Select Material</h3>
                <span className="text-sm text-slate-500">{selectedMaterial ? '1 selected' : 'Choose one'}</span>
              </div>

              <div className="space-y-4 mb-8">
                {materialData.map((mat) => (
                  <div
                    key={mat.id}
                    onClick={() => setSelectedMaterial(mat.id)}
                    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedMaterial === mat.id
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${mat.gradient} rounded-xl flex items-center justify-center text-white text-2xl`}>
                        <i className={`fas ${mat.icon}`}></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-slate-900">{mat.name}</h4>
                        <div className="text-2xl font-bold text-slate-700 mt-1">
                          {mat.price} <span className="text-sm text-slate-500">EGP/kg</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {mat.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">{tag}</span>
                          ))}
                        </div>
                      </div>
                      {selectedMaterial === mat.id && (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                          <i className="fas fa-check"></i>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Enter Weight (kg)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0.0"
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-4 pr-12 border-2 border-slate-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">kg</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {[5, 10, 25, 50, 100].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeight(w.toString())}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all"
                    >
                      {w} kg
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                    <i className="fas fa-money-bill-wave"></i>
                  </div>
                  <span className="text-lg font-semibold">Your Earnings</span>
                </div>

                <div className="text-6xl font-bold mb-8">
                  {Math.round(calculatedTotal)} <span className="text-3xl">EGP</span>
                </div>

                {material && weight && (
                  <div className="space-y-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex justify-between">
                      <span className="text-white/80">Material</span>
                      <span className="font-semibold">{material.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Weight</span>
                      <span className="font-semibold">{weightNum} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Rate</span>
                      <span className="font-semibold">{material.price} EGP/kg</span>
                    </div>
                    <div className="flex justify-between border-t border-white/20 pt-3">
                      <span className="text-white/80">CO₂ Saved</span>
                      <span className="font-semibold">{co2SavedValue.toFixed(2)} kg</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={addItem}
                  className="w-full mt-6 px-6 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                  <i className="fas fa-plus"></i>
                  <span>Add Another Item</span>
                </button>
              </div>

              {/* Environmental Impact */}
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <i className="fas fa-leaf text-green-600 text-2xl"></i>
                  <h4 className="text-xl font-bold text-slate-900">Environmental Impact</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <i className="fas fa-tree text-green-600 text-2xl"></i>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{treesEquivValue.toFixed(1)}</div>
                      <div className="text-slate-600">Trees Saved</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <i className="fas fa-droplet text-blue-600 text-2xl"></i>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{waterSavedValue.toFixed(0)}L</div>
                      <div className="text-slate-600">Water Saved</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Multi Summary */}
          {multiItems.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Transaction Summary</h3>
                <button onClick={clearAll} className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2">
                  <i className="fas fa-trash"></i> Clear All
                </button>
              </div>
              <div className="space-y-4 mb-6">
                {multiItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center text-white`}>
                        <i className={`fas ${item.icon}`}></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{item.materialName}</h4>
                        <p className="text-sm text-slate-600">{item.weight} kg × {item.pricePerKg} EGP/kg</p>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-slate-900">{item.total.toFixed(2)} EGP</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-6 border-t-2 border-slate-200">
                <span className="text-xl font-bold text-slate-900">Grand Total</span>
                <span className="text-3xl font-bold text-green-600">{grandTotal.toFixed(2)} EGP</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm mb-4">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">How Loop Works</h2>
            <p className="text-xl text-slate-600">Four easy steps to turn your recyclables into cash</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '01', icon: 'fa-box-open', title: 'Collect & Sort', desc: 'Gather your metal, paper, or plastic recyclables and separate them by type' },
              { num: '02', icon: 'fa-calculator', title: 'Calculate Value', desc: 'Use our instant calculator to see exactly how much you\'ll earn' },
              { num: '03', icon: 'fa-truck-fast', title: 'Schedule Pickup', desc: 'Choose delivery to our branch or free pickup from your location' },
              { num: '04', icon: 'fa-money-bill-wave', title: 'Get Paid Instantly', desc: 'Receive immediate payment via cash, bank transfer, or mobile wallet' }
            ].map((step, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {step.num}
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl flex items-center justify-center text-blue-600 text-3xl mb-4 mt-4">
                  <i className={`fas ${step.icon}`}></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 px-6 bg-gradient-to-br from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full font-semibold text-sm mb-4">Our Impact</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Making Egypt Greener, Together</h2>
              <p className="text-xl text-white/90 mb-8">Every kilogram you recycle makes a difference. Join our community in creating a sustainable future for Egypt.</p>

              <div className="space-y-6">
                {[
                  { icon: 'fa-leaf', value: '500+ Tons', label: 'Recycled This Year' },
                  { icon: 'fa-tree', value: '8,500 Trees', label: 'Equivalent Saved' },
                  { icon: 'fa-cloud', value: '1,200 Tons', label: 'CO₂ Emissions Reduced' }
                ].map((metric, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                      <i className={`fas ${metric.icon}`}></i>
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold">{metric.value}</h4>
                      <p className="text-white/80">{metric.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative w-64 h-64">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="20" />
                  <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="20" strokeDasharray="565" strokeDashoffset="141" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold">75%</div>
                  <div className="text-lg text-white/80">Recycling Goal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

