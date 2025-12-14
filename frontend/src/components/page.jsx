import React, { useState, useEffect, useRef } from "react";
import "./home.css";
import Navbar from "./Header_Footer/Navbar/page";
import Footer from "./Header_Footer/Footer/page";
import NavbarAfter from "./Header_Footer/NavbarAfter/page";

const CO2_SAVINGS = { metal: 2.5, paper: 1.2, plastic: 1.8 };
const WATER_SAVINGS = { metal: 40, paper: 15, plastic: 25 };
const TREES_EQUIV = { metal: 0.02, paper: 0.017, plastic: 0.015 };

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
  const ref = useRef(null);

  useEffect(() => {
    let start = 0;
    const inc = end / (duration / 16);
    const timer = setInterval(() => {
      start += inc;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

function Notification({ message, type, show, onHide }) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onHide, 4000);
      return () => clearTimeout(t);
    }
  }, [show, onHide]);

  return (
    <div className={`notification ${type} ${show ? "show" : ""}`}>
      {message}
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

  const showNotification = (message, type = "success") =>
    setNotification({ show: true, message, type });

  const hideNotification = () =>
    setNotification((prev) => ({ ...prev, show: false }));

  useEffect(() => {
    if (selectedMaterial && weight) {
      const material = materialData.find((m) => m.id === selectedMaterial);
      setCalculatedTotal(parseFloat(weight) * material.price);
    }
  }, [selectedMaterial, weight]);

  const addItem = () => {
    if (!selectedMaterial || !weight) return;
    const material = materialData.find((m) => m.id === selectedMaterial);
    setMultiItems([
      ...multiItems,
      {
        materialName: material.name,
        weight,
        pricePerKg: material.price,
        total: weight * material.price,
        icon: material.icon,
        iconClass: material.iconClass,
      },
    ]);
    setWeight("");
    setSelectedMaterial(null);
    showNotification("Item added successfully");
  };

  const grandTotal = multiItems.reduce((s, i) => s + i.total, 0);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      <Notification {...notification} onHide={hideNotification} />

      <Navbar />
      <NavbarAfter />

      {/* HERO SECTION (FIXED) */}
      <section className="hero">
        <div className="hero__background" />
        <div className="hero__content">
          <h1>
            Transform Your <span className="gradient-text">Recyclables</span>
            <br />
            Into Real <span className="gradient-text">Money</span>
          </h1>
          <p>
            Join thousands of Egyptians making money while saving the planet.
          </p>

          <div className="hero__stats">
            <div>
              <AnimatedCounter end={50000} /> Users
            </div>
            <div>
              <AnimatedCounter end={500} /> Tons
            </div>
            <div>
              <AnimatedCounter end={2000000} /> EGP
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="calculator">
        <h2>Calculate Your Earnings</h2>

        <div className="material-grid">
          {materialData.map((m) => (
            <div
              key={m.id}
              className={selectedMaterial === m.id ? "active" : ""}
              onClick={() => setSelectedMaterial(m.id)}
            >
              <i className={`fas ${m.icon}`}></i>
              <h4>{m.name}</h4>
            </div>
          ))}
        </div>

        <input
          type="number"
          value={weight}
          placeholder="Weight (kg)"
          onChange={(e) => setWeight(e.target.value)}
        />

        <h3>{Math.round(calculatedTotal)} EGP</h3>

        <button onClick={addItem}>Add Item</button>
      </section>

      {/* SUMMARY */}
      {multiItems.length > 0 && (
        <section>
          <h3>Summary</h3>
          {multiItems.map((i, idx) => (
            <div key={idx}>
              {i.materialName} - {i.weight}kg = {i.total} EGP
            </div>
          ))}
          <strong>Total: {grandTotal} EGP</strong>
        </section>
      )}

      <Footer />
    </>
  );
}
