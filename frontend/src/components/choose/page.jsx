/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import {
  ChevronRight,
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  TrendingUp,
} from "lucide-react";
import "./Choose.css";
import Navbar from "../Header_Footer/Navbar/page";
import Footer from "../Header_Footer/Footer/page";
import { useNavigate } from "react-router-dom";

export default function choose() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  const categories = [
    {
      id: "metal",
      name: "Metal",
      icon: "🥉",
      color: "#3b82f6",
      description: "Recycle metal materials",
      badge: "Best Price",
      subcategories: [
        { id: "iron", name: "Iron", pricePerKg: 5, icon: "⚙️", trend: "+2%" },
        {
          id: "copper",
          name: "Copper",
          pricePerKg: 50,
          icon: "🔴",
          trend: "+5%",
        },
      ],
    },
    {
      id: "paper",
      name: "Paper",
      icon: "📄",
      color: "#f59e0b",
      description: "Recycle paper materials",
      badge: "Eco-Friendly",
      subcategories: [
        {
          id: "newspaper",
          name: "Newspaper",
          pricePerKg: 2,
          icon: "📰",
          trend: "+1%",
        },
        {
          id: "cardboard",
          name: "Cardboard",
          pricePerKg: 3,
          icon: "📦",
          trend: "+3%",
        },
      ],
    },
    {
      id: "plastic",
      name: "Plastic",
      icon: "♻️",
      color: "#8b5cf6",
      description: "Recycle plastic materials",
      badge: "High Demand",
      subcategories: [
        {
          id: "pet",
          name: "PET Bottles",
          pricePerKg: 4,
          icon: "🍾",
          trend: "+4%",
        },
        {
          id: "hdpe",
          name: "HDPE Bags",
          pricePerKg: 3,
          icon: "🛍️",
          trend: "+2%",
        },
      ],
    },
  ];

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory
  );

  const addToCart = (item) => {
    const existingItem = cart.find((c) => c.id === item.id);
    if (existingItem) {
      updateQuantity(item.id, existingItem.quantity + 0.5);
    } else {
      setCart([...cart, { ...item, quantity: 0.5 }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(
        cart.map((item) =>
          item.id === id
            ? { ...item, quantity: parseFloat(newQuantity.toFixed(1)) }
            : item
        )
      );
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const getTotalPrice = (item) => {
    return (item.quantity * item.pricePerKg).toFixed(2);
  };

  const getCartTotal = () => {
    return cart
      .reduce((sum, item) => sum + parseFloat(getTotalPrice(item)), 0)
      .toFixed(2);
  };

  const getTotalWeight = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0).toFixed(1);
  };

  const getEstimatedEarnings = () => {
    return getCartTotal();
  };

  const clearCart = () => {
    setCart([]);
  };

  // UPDATED: Pass cart items to booking page
  const handleCheckout = () => {
    navigate("/booking", { state: { cartItems: cart } });
  };

  return (
    <div className="materials-container">
      <Navbar />

      <div className="materials-wrapper">
        <div className="materials-header">
          <div className="header-content">
            <div className="header-top">
              <h1 className="materials-title">♻️ Choose Your Material</h1>
              <span className="header-badge">Earn While Recycling</span>
            </div>
            <p className="materials-subtitle">
              Select and manage the materials you want to recycle and earn money
            </p>
          </div>

          <button
            className="cart-button"
            onClick={() => setShowCart(!showCart)}
          >
            <div className="cart-icon-wrapper">
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="cart-count">{cart.length}</span>
              )}
            </div>
            <div className="cart-info">
              <span className="cart-label">Total</span>
              <span className="cart-total">{getCartTotal()} EGP</span>
            </div>
          </button>
        </div>

        {showCart ? (
          <div className="cart-view">
            <button className="back-button" onClick={() => setShowCart(false)}>
              <ArrowLeft size={20} />
              Continue Shopping
            </button>

            <div className="cart-header">
              <h2 className="cart-title">🛒 Your Selection</h2>
              {cart.length > 0 && (
                <button className="clear-cart-btn" onClick={clearCart}>
                  Clear All
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-icon">♻️</div>
                <p className="empty-message">Your cart is empty</p>
                <p className="empty-subtitle">
                  Start by selecting materials to recycle
                </p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-left">
                        <div className="cart-item-icon">{item.icon}</div>
                        <div className="cart-item-info">
                          <h3 className="cart-item-name">{item.name}</h3>
                          <p className="cart-item-price">
                            {item.pricePerKg} EGP/kg
                          </p>
                        </div>
                      </div>

                      <div className="cart-quantity-control">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 0.5)
                          }
                          title="Decrease"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <span className="qty-unit">kg</span>
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 0.5)
                          }
                          title="Increase"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="cart-item-total">
                        <span className="total-price">
                          {getTotalPrice(item)} EGP
                        </span>
                        <span className="earning-badge">Earn</span>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="summary-card">
                    <div className="summary-row">
                      <span className="summary-label">📦 Total Weight:</span>
                      <span className="summary-value">
                        {getTotalWeight()} kg
                      </span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">📊 Total Items:</span>
                      <span className="summary-value">{cart.length}</span>
                    </div>
                    <div className="summary-row highlight">
                      <span className="summary-label">💰 Total Earnings:</span>
                      <span className="summary-value earning">
                        {getEstimatedEarnings()} EGP
                      </span>
                    </div>
                  </div>
                </div>

                <div className="checkout-section">
                  <button className="checkout-button" onClick={handleCheckout}>
                    <TrendingUp size={20} />
                    Proceed to Checkout
                  </button>
                  <p className="checkout-note">
                    ✓ Free pickup available in your area
                  </p>
                </div>
              </>
            )}
          </div>
        ) : !selectedCategory ? (
          <div>
            <div className="categories-intro">
              <p className="intro-text">
                🌍 Choose materials and start earning today
              </p>
            </div>
            <div className="categories-grid">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="category-card"
                  onClick={() => setSelectedCategory(category.id)}
                  style={{ "--color": category.color }}
                >
                  <div className="category-badge">{category.badge}</div>
                  <div className="category-icon">{category.icon}</div>
                  <h2 className="category-name">{category.name}</h2>
                  <p className="category-description">{category.description}</p>
                  <div className="category-footer">
                    <span className="subcategory-count">
                      {category.subcategories.length} types
                    </span>
                    <ChevronRight size={20} className="category-arrow" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="subcategories-view">
            <button
              className="back-button"
              onClick={() => setSelectedCategory(null)}
            >
              <ArrowLeft size={20} />
              Back to Materials
            </button>

            <div className="subcategory-header">
              <div
                className="subcategory-icon"
                style={{ "--color": selectedCategoryData.color }}
              >
                {selectedCategoryData.icon}
              </div>
              <h2 className="subcategory-title">{selectedCategoryData.name}</h2>
              <p className="subcategory-description">
                {selectedCategoryData.description}
              </p>
            </div>

            <div className="subcategories-list">
              {selectedCategoryData.subcategories.map((sub) => (
                <div key={sub.id} className="subcategory-item">
                  <div className="item-left">
                    <div className="sub-icon">{sub.icon}</div>
                    <div className="subcategory-info">
                      <h3 className="subcategory-name">{sub.name}</h3>
                      <div className="price-info">
                        <span className="subcategory-price-per">
                          {sub.pricePerKg} EGP/kg
                        </span>
                        <span
                          className={`trend ${
                            sub.trend.includes("+") ? "up" : "down"
                          }`}
                        >
                          <TrendingUp size={14} />
                          {sub.trend}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="add-button"
                    onClick={() =>
                      addToCart({
                        id: sub.id,
                        name: sub.name,
                        icon: sub.icon,
                        pricePerKg: sub.pricePerKg,
                      })
                    }
                    title="Add to cart"
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
