import { useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import "./login.css";
import Navbar from "../../Header_Footer/Navbar/page";
import Footer from "../../Header_Footer/Footer/page";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
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

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
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
        const response = await fetch("http://localhost:8081/login", {
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
          localStorage.setItem("userId", data.user.id.toString());
          localStorage.setItem("user", JSON.stringify(data.user));

          if (formData.rememberMe) {
            localStorage.setItem("rememberMe", "true");
          }

          console.log("Login successful:", data);

          setTimeout(() => {
            navigate("/homeAfter"); 
          }, 2000);
        } else {
          // Login failed
          setErrors({
            general: data.message || "Invalid email or password",
          });
        }
      } catch (error) {
        console.error("Login error:", error);
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
      <Navbar />
      <div className="login-wrapper">
          <div className="login-card">
            <div className="login-header">
              <h1 className="login-title">Sign In</h1>
              <p className="login-subtitle">
                Welcome back! Please login to your account
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
                  placeholder="john@example.com"
                  disabled={loading}
                />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input ${
                      errors.password ? "form-input-error" : ""
                    }`}
                    placeholder="At least 8 characters"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <p className="signup-text">
                Don't have an account?{" "}
                <span
                  className="signup-link"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </span>
              </p>
            </div>
          </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}