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
    error,
    message,
    loginLoading,
    loginError,
    loginMessage,
    loginSuccess,
    token,
    user,
    isAuthenticated,
  } = useSelector((state) => state.user);

  console.log("Redux user state:", {
    isAuthenticated,
    user,
    loading,
    error,
    message,
  });

  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [hasSubmittedLogin, setHasSubmittedLogin] = useState(false);

  useEffect(() => {
    dispatch(clearloginSuccess());
    dispatch(clearloginError());
  }, [dispatch]);

  useEffect(() => {
    console.log("login", loginSuccess);
    if (loginSuccess && hasSubmittedLogin) {
      dispatch(getSections());
      navigate("/");
      dispatch(clearloginSuccess());
    }
    if (loginError && hasSubmittedLogin) {
      toast.error(loginMessage, {
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
    user,
    token,
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

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
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
          email: formData.email,
          password: formData.password,
        }),
      );
    }
  };

  return (
    <div className="login-container">
      {loading ? (
        <Loading />
      ) : (
        <div className="login-form-container">
          <h2>Welcome Back</h2>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-error">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={errors.email ? "error" : ""}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-error">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={errors.password ? "error" : ""}
                />
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>
            </div>

            <div className="forgot-password-container">
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loginLoading}
            >
              {loginLoading ? "Logging in..." : "Login"}
            </button>

            <div className="login-footer">
              <p>
                Don't have an account? <a href="/signup">Sign Up</a>
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
