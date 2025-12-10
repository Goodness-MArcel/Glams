import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../api/auth";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Call the login API
      const response = await authAPI.login(formData.email, formData.password);
      
      console.log("Login successful:", response);
      
      // Navigate to admin dashboard on successful login
      navigate("/admin/dashboard/overview");
      
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ 
        general: error.message || "Login failed. Please check your credentials and try again." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: "Please enter your email address first" });
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.forgotPassword(formData.email);
      alert("Password reset email sent! Please check your inbox.");
    } catch (error) {
      setErrors({ 
        general: error.message || "Failed to send password reset email" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          {/* Header */}
          <div className="login-header">
            <div className="admin-logo">
              <i className="bi bi-shield-lock-fill"></i>
            </div>
            <h2 className="login-title">Admin Portal</h2>
            <p className="login-subtitle">Sign in to manage Glams</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {errors.general && (
              <div className="alert alert-danger mb-3">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {errors.general}
              </div>
            )}

            {/* Email Field */}
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>

              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope-fill"></i>
                </span>

                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              {errors.email && (
                <div className="invalid-feedback d-block">{errors.email}</div>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>

              <div className="input-group">
                {/* Lock Icon */}
                <span className="input-group-text bg-white">
                  <i className="bi bi-lock-fill"></i>
                </span>

                {/* Password Field */}
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />

                {/* Toggle Visibility Button */}
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  style={{ borderLeft: "0" }}
                >
                  <i
                    className={`bi ${
                      showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                    }`}
                  ></i>
                </button>
              </div>

              {errors.password && (
                <div className="invalid-feedback d-block">
                  {errors.password}
                </div>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberMe"
                  disabled={isLoading}
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="forgot-password-btn"
                disabled={isLoading}
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-btn w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer mt-4">
            <p className="text-center mb-0">
              <small>Secure admin access for Glams management</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
