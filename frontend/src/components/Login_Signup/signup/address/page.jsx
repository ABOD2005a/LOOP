/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import "./Address.css";
import { useNavigate } from "react-router-dom";

export default function Address() {
  const [formData, setFormData] = useState({
    governorate: "",
    city: "",
    buildingNumber: "",
    floor: "",
    apartment: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const governorates = [
    "Alexandria",
    "Aswan",
    "Asyut",
    "Beheira",
    "Beni Suef",
    "Cairo",
    "Dakahlia",
    "Damietta",
    "Faiyum",
    "Gharbia",
    "Giza",
    "Ismailia",
    "Kafr El Sheikh",
    "Luxor",
    "Matruh",
    "Minya",
    "Monufia",
    "New Valley",
    "North Sinai",
    "Port Said",
    "Qalyubia",
    "Qena",
    "Red Sea",
    "Sharqia",
    "Sohag",
    "South Sinai",
    "Suez",
  ];

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    console.log("👤 User from localStorage:", userStr);

    if (!userStr) {
      alert("Please Sign up first");
      navigate("/signup");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      console.log("✅ Parsed user:", user);

      if (user && user.id) {
        setUserId(user.id);
        console.log("✅ User ID set:", user.id);
      } else {
        alert("User ID not found. Please login again.");
        navigate("/login");
      }
    } catch (error) {
      console.error("❌ Error parsing user data:", error);
      alert("Invalid user data. Please login again.");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.governorate)
      newErrors.governorate = "Governorate is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.buildingNumber.trim())
      newErrors.buildingNumber = "Building number is required";
    if (!formData.floor.trim()) newErrors.floor = "Floor is required";
    if (!formData.apartment.trim())
      newErrors.apartment = "Apartment is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    if (!userId) {
      console.error("❌ No user ID available");
      alert("User not found. Please login again.");
      navigate("/login");
      return;
    }

    console.log("📝 Submitting with user_id:", userId);

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        user_id: userId,
        governorate: formData.governorate,
        city: formData.city,
        building_number: formData.buildingNumber,
        floor: formData.floor,
        apartment: formData.apartment,
      };

      console.log("📦 Sending payload:", payload);

      const response = await fetch("http://localhost:8081/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("✅ Response:", data);

      if (response.ok) {
        
        setFormData({
          governorate: "",
          city: "",
          buildingNumber: "",
          floor: "",
          apartment: "",
        });

        navigate("/homeAfter");
      } else {
        setErrors({ general: data.message || "Failed to save address" });
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setErrors({ general: "Unable to connect to server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <div className="signup-card">
          <div className="signup-header">
            <h1 className="signup-title">Address Information</h1>
            <p className="signup-subtitle">Enter your address details</p>
          </div>
          <form className="signup-form" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="form-error general-error">{errors.general}</div>
            )}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Governorate</label>
                <select
                  name="governorate"
                  value={formData.governorate}
                  onChange={handleChange}
                  className={`form-input ${
                    errors.governorate ? "form-input-error" : ""
                  }`}
                  disabled={loading}
                >
                  <option value="">Select Governorate</option>
                  {governorates.map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
                {errors.governorate && (
                  <p className="form-error">{errors.governorate}</p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`form-input ${
                    errors.city ? "form-input-error" : ""
                  }`}
                  placeholder="Enter city name"
                  disabled={loading}
                />
                {errors.city && <p className="form-error">{errors.city}</p>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Building Number</label>
                <input
                  type="text"
                  name="buildingNumber"
                  value={formData.buildingNumber}
                  onChange={handleChange}
                  className={`form-input ${
                    errors.buildingNumber ? "form-input-error" : ""
                  }`}
                  placeholder="e.g., 123"
                  disabled={loading}
                />
                {errors.buildingNumber && (
                  <p className="form-error">{errors.buildingNumber}</p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Floor</label>
                <input
                  type="text"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className={`form-input ${
                    errors.floor ? "form-input-error" : ""
                  }`}
                  placeholder="e.g., 3"
                  disabled={loading}
                />
                {errors.floor && <p className="form-error">{errors.floor}</p>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Apartment</label>
              <input
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                className={`form-input ${
                  errors.apartment ? "form-input-error" : ""
                }`}
                placeholder="e.g., 5A"
                disabled={loading}
              />
              {errors.apartment && (
                <p className="form-error">{errors.apartment}</p>
              )}
            </div>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Address"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}