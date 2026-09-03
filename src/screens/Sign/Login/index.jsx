import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logIn } from "../../../../store/User/UserAction";
import { getSections } from "../../../../store/Section/SectionAction";
import Loading from "../../../components/Loading";
import {
  clearloginError,
  clearloginSuccess,
} from "../../../../store/User/UserReducer";
import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    loginLoading,
    loginError,
    loginMessage,
    loginSuccess,
    user,
    isAuthenticated,
  } = useSelector((state) => state.user);

  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [hasSubmittedLogin, setHasSubmittedLogin] = useState(false);

  useEffect(() => {
    dispatch(clearloginSuccess());
    dispatch(clearloginError());
  }, [dispatch]);

  useEffect(() => {
    if (loginSuccess && hasSubmittedLogin) {
      dispatch(getSections());
      navigate("/");
      dispatch(clearloginSuccess());
    }
    if (loginError && hasSubmittedLogin) {
      toast.error(loginMessage || "Invalid email or password", {
        position: "top-right",
        bodyStyle: { fontSize: "16px" },
      });
      dispatch(clearloginError());
    }
  }, [
    loginSuccess,
    loginError,
    loginMessage,
    navigate,
    dispatch,
    hasSubmittedLogin,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
    };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Invalid email format";
        isValid = false;
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setHasSubmittedLogin(true);
      dispatch(
        logIn({
          email: formData.email.trim(),
          password: formData.password,
        }),
      );
    }
  };

  return (
    <div className="auth-page-wrapper">
      {loading ? (
        <Loading />
      ) : (
        <div className="auth-card-container">
          <div className="auth-card-header">
            <div className="auth-logo-badge">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
                <path d="M6 14h6" />
              </svg>
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Log in to continue your learning journey on Learnmate</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="auth-form-group">
              <label htmlFor="login-email" className="auth-label">
                Email Address
              </label>
              <div className="auth-input-wrapper">
                <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className={`auth-input ${errors.email ? "input-error" : ""}`}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <span className="auth-field-error">{errors.email}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="auth-form-group">
              <div className="auth-label-row">
                <label htmlFor="login-password" className="auth-label">
                  Password
                </label>
                <Link to="/forgot-password" className="auth-forgot-link">
                  Forgot password?
                </Link>
              </div>
              <div className="auth-input-wrapper">
                <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`auth-input ${errors.password ? "input-error" : ""}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                      <line x1="2" x2="22" y1="2" y2="22"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="auth-field-error">{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={loginLoading}
            >
              {loginLoading ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="auth-footer-text">
              Don't have an account?{" "}
              <Link to="/signup" className="auth-switch-link">
                Create an account
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
