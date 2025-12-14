/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Home,
  CheckCircle,
  ArrowLeft,
  Loader,
  MapPin,
  Phone,
  Mail,
  User,
  TrendingUp,
  Package,
} from "lucide-react";
import "./Booking.css";
import Navbar from "../Header_Footer/Navbar/page";
import Footer from "../Header_Footer/Footer/page";
import { useLocation, useNavigate } from "react-router-dom";

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = location.state?.cartItems || [];

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [bookingData, setBookingData] = useState({
    fullName: "",
    email: "",
    address: "",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    time: "",
    notes: "",
  });

  const timeSlots = [
    "08:00 AM",
    "10:00 AM",
    "12:00 PM",
    "02:00 PM",
    "04:00 PM",
    "06:00 PM",
  ];

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Get user data from localStorage
        const userData = localStorage.getItem("user");

        if (!userData) {
          // User is not logged in, redirect to login
          alert("Please login first to book a pickup");
          navigate("/login");
          return;
        }

        const user = JSON.parse(userData);
        const fullName = `${user.first_name} ${user.last_name}`;

        setBookingData((prev) => ({
          ...prev,
          fullName: fullName,
          email: user.gmail,
        }));

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const { latitude, longitude } = pos.coords;
              console.log("Location detected:", latitude, longitude);

              try {
                const geoRes = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                );
                const geo = await geoRes.json();

                const address = geo.address
                  ? `${geo.address.road || ""} ${geo.address.city || ""} ${
                      geo.address.postcode || ""
                    }`.trim()
                  : `Located at: ${latitude.toFixed(4)}, ${longitude.toFixed(
                      4
                    )}`;

                setBookingData((p) => ({
                  ...p,
                  address: address || "Location detected",
                }));
                setLocationError(false);
              } catch (err) {
                console.log("Geocoding error:", err);
                setBookingData((p) => ({
                  ...p,
                  address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                }));
                setLocationError(false);
              }

              setLoading(false);
            },
            (error) => {
              console.log("Geolocation error code:", error.code);
              console.log("Geolocation error message:", error.message);

              setLocationError(true);
              setLoading(false);
            }
          );
        } else {
          setLocationError(true);
          setLoading(false);
        }
      } catch (err) {
        console.log("Error:", err);
        setLoading(false);
      }
    };

    detectLocation();
  }, [navigate]);

  const validateStep = () => {
    if (step === 1) return bookingData.address;
    if (step === 2) return bookingData.date && bookingData.time;
    return true;
  };

  const getTotalWeight = () =>
    cartItems.reduce((s, i) => s + i.quantity, 0).toFixed(1);

  const getCartTotal = () =>
    cartItems.reduce((s, i) => s + i.quantity * i.pricePerKg, 0).toFixed(2);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setStep(1);
      setSubmitted(false);
    }, 3000);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="booking-container">
          <div className="booking-wrapper">
            <div className="loading-screen">
              <Loader size={48} className="loading-spinner" />
              <p className="loading-text">Loading your information...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="booking-container">
        <div className="booking-wrapper">
          {submitted ? (
            <div className="success-screen">
              <div className="success-icon">
                <CheckCircle size={80} />
              </div>
              <h2 className="success-title">Booking Confirmed! ✨</h2>
              <p className="success-message">
                Your pickup has been scheduled successfully
              </p>

              <div className="booking-details">
                <div className="detail-row">
                  <span className="detail-label">👤 Name:</span>
                  <span className="detail-value">{bookingData.fullName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📧 Email:</span>
                  <span className="detail-value">{bookingData.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📅 Date:</span>
                  <span className="detail-value">{bookingData.date}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">⏰ Time:</span>
                  <span className="detail-value">{bookingData.time}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📍 Location:</span>
                  <span className="detail-value">{bookingData.address}</span>
                </div>
                {cartItems.length > 0 && (
                  <div className="detail-row highlight">
                    <span className="detail-label">💰 Total Earning:</span>
                    <span className="detail-value">{getCartTotal()} EGP</span>
                  </div>
                )}
              </div>

              <p className="success-note">
                Our team will arrive at your location on the scheduled time
              </p>
            </div>
          ) : (
            <>
              <div className="booking-header">
                <h1 className="booking-title">📦 Book Your Pickup</h1>
                <p className="booking-subtitle">
                  Schedule a convenient time for us to collect your recyclables
                </p>

                <div className="step-indicator">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`step ${step >= s ? "active" : ""} ${
                        step === s ? "current" : ""
                      }`}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-container">
                {step === 1 && (
                  <div className="form-step">
                    <div className="step-title-section">
                      <h2 className="step-title">Pickup Location</h2>
                      <p className="step-description">
                        Your address is auto-detected from your location
                      </p>
                    </div>

                    <div className="address-box">
                      <MapPin className="address-icon" size={24} />
                      <div className="address-content">
                        <p className="address-label">Your Address</p>
                        <p className="address-value">
                          {bookingData.address || "Detecting location..."}
                        </p>
                      </div>
                    </div>

                    {locationError && (
                      <div className="error-message">
                        ⚠️ Location permission denied. Please enter your address
                        manually below.
                      </div>
                    )}

                    <div className="form-group">
                      <label className="form-label">
                        📍 Enter Address Manually
                      </label>
                      <textarea
                        name="address"
                        value={bookingData.address}
                        onChange={handleChange}
                        placeholder="Enter your complete address (street, building, apartment, city, postal code)"
                        className="form-textarea"
                        rows="3"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="form-step">
                    <div className="step-title-section">
                      <h2 className="step-title">Schedule Pickup</h2>
                      <p className="step-description">
                        Choose a convenient date and time
                      </p>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <Calendar size={18} /> Pickup Date
                      </label>
                      <input
                        type="date"
                        value={bookingData.date}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            date: e.target.value,
                          })
                        }
                        className="form-input"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    {bookingData.date && (
                      <div className="form-group">
                        <label className="form-label">
                          <Clock size={18} /> Pickup Time
                        </label>
                        <div className="time-slots">
                          {timeSlots.map((t) => (
                            <button
                              key={t}
                              className={`time-slot ${
                                bookingData.time === t ? "selected" : ""
                              }`}
                              onClick={() =>
                                setBookingData({ ...bookingData, time: t })
                              }
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="form-group">
                      <label className="form-label">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        value={bookingData.notes}
                        onChange={handleChange}
                        placeholder="Any special instructions or notes for pickup..."
                        className="form-textarea"
                        rows="3"
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="form-step">
                    <div className="step-title-section">
                      <h2 className="step-title">Review Your Booking</h2>
                      <p className="step-description">
                        Please verify all details before confirming
                      </p>
                    </div>

                    <div className="review-cards">
                      <div className="review-card">
                        <h3 className="review-title">Personal Information</h3>
                        <div className="review-row">
                          <span className="icon">
                            <User size={18} />
                          </span>
                          <span>{bookingData.fullName}</span>
                        </div>
                        <div className="review-row">
                          <span className="icon">
                            <Mail size={18} />
                          </span>
                          <span>{bookingData.email}</span>
                        </div>
                      </div>

                      <div className="review-card">
                        <h3 className="review-title">Pickup Details</h3>
                        <div className="review-row">
                          <span className="icon">
                            <MapPin size={18} />
                          </span>
                          <span>{bookingData.address}</span>
                        </div>
                        <div className="review-row">
                          <span className="icon">
                            <Calendar size={18} />
                          </span>
                          <span>{bookingData.date}</span>
                        </div>
                        <div className="review-row">
                          <span className="icon">
                            <Clock size={18} />
                          </span>
                          <span>{bookingData.time}</span>
                        </div>
                        {bookingData.notes && (
                          <div className="review-row">
                            <span className="icon">📝</span>
                            <span>{bookingData.notes}</span>
                          </div>
                        )}
                      </div>

                      {cartItems.length > 0 && (
                        <div className="review-card">
                          <h3 className="review-title">Materials Summary</h3>
                          <div className="materials-mini">
                            {cartItems.map((item) => (
                              <div key={item.id} className="mini-item">
                                <span>
                                  {item.icon} {item.name}
                                </span>
                                <span className="qty">{item.quantity} kg</span>
                              </div>
                            ))}
                          </div>
                          <div className="total-line">
                            <span>Total Earning:</span>
                            <span className="total">{getCartTotal()} EGP</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="button-group">
                {step > 1 && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => setStep(step - 1)}
                  >
                    <ArrowLeft size={18} /> Previous
                  </button>
                )}

                {step < 3 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setStep(step + 1)}
                    disabled={!validateStep()}
                  >
                    Next
                  </button>
                ) : (
                  <button className="btn btn-success" onClick={handleSubmit}>
                    <CheckCircle size={18} /> Confirm Booking
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
}
