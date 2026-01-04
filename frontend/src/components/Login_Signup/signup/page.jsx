import { useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // ✅ إضافة

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // مسح الخطأ عند الكتابة
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    // مسح الخطأ العام
    if (errors.general) {
      setErrors((prev) => ({
        ...prev,
        general: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) 
      newErrors.lastName = "Last name is required";
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
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // مسح الرسائل السابقة
    setErrors({});
    setSuccessMessage("");
    
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      try {
        console.log("📤 Sending signup request...");
        
        const response = await fetch(`${API_URL}/api/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            gmail: formData.email.trim().toLowerCase(),
            password: formData.password,
            confirm_password: formData.confirmPassword,
          }),
        });

        console.log("📥 Response status:", response.status);

        // محاولة قراءة الـ response
        let data;
        try {
          data = await response.json();
          console.log("📄 Response data:", data);
        } catch (jsonError) {
          console.error("❌ Failed to parse JSON:", jsonError);
          throw new Error("Invalid response from server");
        }

        if (response.ok) {
          console.log("✅ Signup successful!");
          
          setSuccessMessage("Account created successfully! Redirecting...");
          
          // حفظ بيانات المستخدم
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("user", JSON.stringify(data.user));

          console.log("✅ User saved to localStorage");

          // الانتقال لصفحة العنوان
          setTimeout(() => {
            navigate("/address");
          }, 1500);
          
        } else {
          // عرض الخطأ من السيرفر
          console.error("❌ Signup failed:", data);
          
          let errorMessage = "Signup failed. Please try again.";
          
          // التعامل مع أنواع مختلفة من الأخطاء
          if (data.message) {
            errorMessage = data.message;
          } else if (data.error) {
            errorMessage = data.error;
          }
          
          // أخطاء محددة
          if (response.status === 409) {
            errorMessage = "This email is already registered. Please login instead.";
          } else if (response.status === 400) {
            errorMessage = data.message || "Please check your input and try again.";
          } else if (response.status === 500) {
            errorMessage = "Server error. Please try again later.";
          }
          
          setErrors({
            general: errorMessage,
          });
        }
      } catch (error) {
        console.error("❌ Network/Server error:", error);
        
        let errorMessage = "Unable to connect to server. Please check your internet connection.";
        
        if (error.message === "Failed to fetch") {
          errorMessage = "Cannot reach server. Please check your internet connection.";
        } else if (error.message === "Invalid response from server") {
          errorMessage = "Server returned invalid response. Please try again.";
        }
        
        setErrors({
          general: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
      console.log("❌ Validation errors:", newErrors);
    }
  };
  
  return (
    <div className="signup_container">
      <div className="signup-wrapper">
        <div className="signup_card">
          <div className="signup-header">
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">
              Join us today and get started in minutes
            </p>
          </div>

          <div className="signup-form">
            {errors.general && (
              <div className="form-error general-error">{errors.general}</div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`form-input ${
                    errors.firstName ? "form-input-error" : ""
                  }`}
                  placeholder="Amr"
                  disabled={loading}
                />
                {errors.firstName && (
                  <p className="form-error">{errors.firstName}</p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`form-input ${
                    errors.lastName ? "form-input-error" : ""
                  }`}
                  placeholder="Mohamed"
                  disabled={loading}
                />
                {errors.lastName && (
                  <p className="form-error">{errors.lastName}</p>
                )}
              </div>
            </div>

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

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${
                    errors.confirmPassword ? "form-input-error" : ""
                  }`}
                  placeholder="Re-enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="form-error">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="terms-wrapper">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="terms-checkbox"
                id="terms"
                disabled={loading}
              />
              <label htmlFor="terms" className="terms-label">
                I agree to the{" "}
                <span className="terms-link">Terms of Service</span> and{" "}
                <span className="terms-link">Privacy Policy</span>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="form-error">{errors.agreeToTerms}</p>
            )}

            <button
              onClick={handleSubmit}
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="signin-text">
              Already have an account?{" "}
              <span className="signin-link" onClick={() => navigate("/login")}>
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
