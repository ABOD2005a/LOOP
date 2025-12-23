import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./collectorLogin.css";
import { useNavigate } from "react-router-dom";

export default function CollectorLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "", // Changed from collectorId to password
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setErrors({});

      try {
        const response = await fetch("http://localhost:8081/api/collector", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gmail: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("collectorId", data.collector.id.toString());
          localStorage.setItem("collectorEmail", formData.email);
          localStorage.setItem("collector", JSON.stringify(data.collector));
          localStorage.setItem("userType", "collector");

          if (formData.rememberMe) {
            localStorage.setItem("rememberMe", "true");
          }

          console.log("Collector login successful:", data);

          setTimeout(() => {
            navigate("/CollectorDashboard"); 
          }, 500);
        } else {
          setErrors({
            general: data.message || "Invalid email or password",
          });
        }
      } catch (error) {
        console.error("Collector login error:", error);
        setErrors({
          general: "Unable to connect to server. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Collector Login</h1>
            <p className="login-subtitle">
              Please enter your email and password
            </p>
          </div>

          <div className="login-form">
            {errors.general && (
              <div className="form-error general-error">{errors.general}</div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${
                  errors.email ? "form-input-error" : ""
                }`}
                placeholder="collector@example.com"
                disabled={loading}
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${
                  errors.password ? "form-input-error" : ""
                }`}
                placeholder="Enter your password"
                disabled={loading}
              />
              {errors.password && (
                <p className="form-error">{errors.password}</p>
              )}
            </div>

            <div className="remember-wrapper">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="remember-checkbox"
                id="remember"
                disabled={loading}
              />
              <label htmlFor="remember" className="remember-label">
                Remember me
              </label>
              <a href="#" className="forgot-link">
                Forgot Password?
              </a>
            </div>

            <button
              onClick={handleSubmit}
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Signing In..." : "login as Collector"}
            </button>

            <button
              onClick={() => navigate("/login")}
              className="back-btn"
              disabled={loading}
            >
              Back to Regular Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}