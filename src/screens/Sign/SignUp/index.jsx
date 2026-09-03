import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../../../components/Loading';
import { initiateSignup, verifyOtp, saveUser } from '../../../../store/User/UserAction';
import {
  clearSignupError,
  clearSignupSuccess,
  clearVerifyOtpError,
  clearVerifyOtpSuccess,
  clearSaveUserError,
  clearSaveUserSuccess,
} from '../../../../store/User/UserReducer';
import './Signup.css';
import './OTP.css';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    signupLoading,
    signupError,
    signupSuccess,
    signupMessage,
    verifyOtpLoading,
    verifyOtpError,
    verifyOtpSuccess,
    verifyOtpMessage,
    token,
    saveUserLoading,
    saveUserError,
    saveUserSuccess,
    saveUserMessage,
  } = useSelector((state) => state.user);

  const [formData, setformData] = useState({
    name: '',
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });

  const [verificationToken, setVerificationToken] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(120);
  const [isActive, setIsActive] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [submittingUser, setSubmittingUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    dispatch(clearSignupSuccess());
    dispatch(clearSignupError());
    dispatch(clearVerifyOtpSuccess());
    dispatch(clearVerifyOtpError());
    dispatch(clearSaveUserSuccess());
    dispatch(clearSaveUserError());
  }, [dispatch]);

  useEffect(() => {
    if (currentStep === 2) {
      setTimer(120);
      setIsActive(false);
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== 2) return;
    if (timer === 0) {
      setIsActive(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStep, timer]);

  useEffect(() => {
    if (signupSuccess && currentStep === 1 && otpSent) {
      setCurrentStep(2);
      dispatch(clearSignupSuccess());
    }
    if (verifyOtpSuccess && currentStep === 2 && otpVerified) {
      if (token) {
        setVerificationToken(token);
        setCurrentStep(3);
        dispatch(clearVerifyOtpSuccess());
      } else {
        toast.error('No verification token received!', {
          position: 'top-right',
          bodyStyle: { fontSize: '16px' },
        });
      }
    }
    if (saveUserSuccess && submittingUser) {
      toast.success('Account created successfully! Welcome to Learnmate.', {
        position: 'top-right',
        bodyStyle: { fontSize: '16px' },
      });
      navigate('/');
      dispatch(clearSaveUserSuccess());
    }
  }, [
    signupSuccess,
    verifyOtpSuccess,
    saveUserSuccess,
    currentStep,
    dispatch,
    navigate,
    token,
    verifyOtpMessage,
    otpSent,
    otpVerified,
    submittingUser,
  ]);

  const handleResend = () => {
    setIsActive(false);
    setTimer(120);
    setOtpSent(true);
    dispatch(
      initiateSignup({
        name: formData.name.trim(),
        email: formData.email.trim(),
      }),
    );
  };

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.querySelector(`input[name=otp-${index - 1}]`);
      if (prevInput) prevInput.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.querySelector(`input[name=otp-${index - 1}]`);
      if (prevInput) prevInput.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        toast.error('Please enter your name');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        toast.error('Please enter a valid email address');
        return;
      }

      setOtpSent(true);
      dispatch(
        initiateSignup({
          name: formData.name.trim(),
          email: formData.email.trim(),
        }),
      );
    } else if (currentStep === 2) {
      if (otpValues.some((value) => !value)) {
        toast.error('Please enter the complete 6-digit verification code', {
          position: 'top-right',
          bodyStyle: { fontSize: '16px' },
        });
        return;
      }
      const otp = otpValues.join('');
      setOtpVerified(true);
      dispatch(
        verifyOtp({
          email: formData.email.trim(),
          otp,
        }),
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!verificationToken) {
      toast.error('Verification token is missing. Please restart signup.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setSubmittingUser(true);
    dispatch(
      saveUser({
        token: verificationToken,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      }),
    );
  };

  return (
    <div className="signup-page-wrapper">
      {signupLoading && currentStep === 1 ? (
        <Loading />
      ) : (
        <div className="signup-card-container">
          {/* Header */}
          <div className="signup-card-header">
            <div className="auth-logo-badge">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
              </svg>
            </div>
            <h1 className="signup-title">Create an Account</h1>
            <p className="signup-subtitle">Join Learnmate and accelerate your learning</p>
          </div>

          {/* Stepper Indicator */}
          <div className="stepper-indicator-wrapper">
            <div className={`stepper-item ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="stepper-bubble">{currentStep > 1 ? '✓' : '1'}</div>
              <span className="stepper-label">Details</span>
            </div>
            <div className={`stepper-line ${currentStep >= 2 ? 'active' : ''}`}></div>
            <div className={`stepper-item ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="stepper-bubble">{currentStep > 2 ? '✓' : '2'}</div>
              <span className="stepper-label">Verify</span>
            </div>
            <div className={`stepper-line ${currentStep >= 3 ? 'active' : ''}`}></div>
            <div className={`stepper-item ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="stepper-bubble">3</div>
              <span className="stepper-label">Security</span>
            </div>
          </div>

          <form className="signup-form-body" onSubmit={handleSubmit}>
            {/* STEP 1: Basic Information */}
            {currentStep === 1 && (
              <div className="form-step-content">
                {signupError && (
                  <div className="alert-error-box">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{signupMessage || 'An error occurred during signup.'}</span>
                  </div>
                )}

                <div className="auth-form-group">
                  <label htmlFor="signup-name" className="auth-label">
                    Full Name
                  </label>
                  <div className="auth-input-wrapper">
                    <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      type="text"
                      id="signup-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Alex Johnson"
                      className="auth-input"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label htmlFor="signup-email" className="auth-label">
                    Email Address
                  </label>
                  <div className="auth-input-wrapper">
                    <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <input
                      type="email"
                      id="signup-email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className="auth-input"
                      required
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary auth-submit-btn"
                  onClick={handleNextStep}
                  disabled={signupLoading}
                >
                  {signupLoading ? 'Sending verification code...' : 'Continue to Verification'}
                </button>
              </div>
            )}

            {/* STEP 2: OTP Verification */}
            {currentStep === 2 && (
              <div className="form-step-content">
                <div className="otp-step-header">
                  <div className="otp-email-chip">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span>{formData.email}</span>
                  </div>
                  <p className="otp-instruction-text">
                    Enter the 6-digit verification code sent to your email.
                  </p>
                </div>

                {verifyOtpError && (
                  <div className="alert-error-box">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{verifyOtpMessage || 'Invalid OTP code. Please try again.'}</span>
                  </div>
                )}

                <div className="otp-boxes-wrapper">
                  {otpValues.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      name={`otp-${index}`}
                      className={`otp-digit-box ${value ? 'has-digit' : ''}`}
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      maxLength={1}
                      autoFocus={index === 0}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  ))}
                </div>

                <div className="otp-timer-row">
                  <span className="timer-text">
                    Code expires in: <strong className="timer-countdown">{formatTime(timer)}</strong>
                  </span>
                  <button
                    type="button"
                    className="resend-link-btn"
                    disabled={!isActive}
                    onClick={handleResend}
                  >
                    Resend Code
                  </button>
                </div>

                <button
                  type="button"
                  className="btn btn-primary auth-submit-btn"
                  onClick={handleNextStep}
                  disabled={verifyOtpLoading}
                >
                  {verifyOtpLoading ? 'Verifying code...' : 'Verify & Continue'}
                </button>
              </div>
            )}

            {/* STEP 3: Password Setup */}
            {currentStep === 3 && (
              <div className="form-step-content">
                {saveUserError && (
                  <div className="alert-error-box">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{saveUserMessage || 'Unable to save password. Please try again.'}</span>
                  </div>
                )}

                <div className="auth-form-group">
                  <label htmlFor="signup-password" className="auth-label">
                    Create Password
                  </label>
                  <div className="auth-input-wrapper">
                    <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="signup-password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="At least 6 characters"
                      className="auth-input"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="auth-form-group">
                  <label htmlFor="signup-confirm-password" className="auth-label">
                    Confirm Password
                  </label>
                  <div className="auth-input-wrapper">
                    <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="signup-confirm-password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Re-enter password"
                      className="auth-input"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary auth-submit-btn"
                  disabled={saveUserLoading}
                >
                  {saveUserLoading ? 'Creating Account...' : 'Complete Sign Up'}
                </button>
              </div>
            )}

            <div className="auth-footer-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-switch-link">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SignUp;