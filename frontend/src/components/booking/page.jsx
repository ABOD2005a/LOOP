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
import NavbarAfter from "../Header_Footer/NavbarAfter/page";

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = location.state?.cartItems || [];

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addressError, setAddressError] = useState(false);
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
    const fetchUserData = async () => {
      try {
        const userData = localStorage.getItem("user");

        if (!userData) {
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
        try {
          const response = await fetch(
            `http://localhost:8081/api/address/${user.id}`
          );
          const data = await response.json();

          if (response.ok && data.hasAddress) {
            const addr = data.address;
            const formattedAddress = `${addr.building_number}, Floor ${addr.floor}, Apt ${addr.apartment}, ${addr.city}, ${addr.governorate}`;

            setBookingData((prev) => ({
              ...prev,
              address: formattedAddress,
            }));
            setAddressError(false);
          } else {
            setAddressError(true);
          }
        } catch (err) {
          console.log("Error fetching address:", err);
          setAddressError(true);
        }

        setLoading(false);
      } catch (err) {
        console.log("Error:", err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const validateStep = () => {
    if (step === 1) return bookingData.date && bookingData.time;
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
      navigate("/homeAfter")
    }, 4000);
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
      <NavbarAfter />

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
                  {[1, 2].map((s) => (
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

                {step === 2 && (
                  <div className="form-step">
                    <div className="step-title-section">
                      <h2 className="step-title">Review Your Booking</h2>
                      <p className="step-description">
                        Please verify all details before confirming
                      </p>
                    </div>

                    {addressError && (
                      <div className="error-message">
                        ⚠️ No address found in your profile. Please add your
                        address in your profile settings first.
                      </div>
                    )}

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
                          <span>
                            {bookingData.address || "No address available"}
                          </span>
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

                {step < 2 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setStep(step + 1)}
                    disabled={!validateStep()}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={handleSubmit}
                    disabled={addressError || !bookingData.address}
                  >
                    <CheckCircle size={18} /> Confirm Booking
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}