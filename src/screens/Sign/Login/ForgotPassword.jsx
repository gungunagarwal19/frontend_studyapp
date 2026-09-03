import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const ForgotPassword = ({ onBackToLogin }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await fetch(
                "http://localhost:8001/api/user/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Something went wrong"
                );
            }

            setMessage(
                "Password reset instructions have been sent to your email."
            );
            setEmail("");

        } catch (err) {
            setError(err.message || "Unable to send reset instructions");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (onBackToLogin) {
            onBackToLogin();
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card-container">
                <div className="auth-card-header">
                    <div className="auth-logo-badge">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <rect width="20" height="16" x="2" y="4" rx="2"/>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                        </svg>
                    </div>
                    <h1 className="auth-title">Forgot Password</h1>
                    <p className="auth-subtitle">
                        Enter your email address and we'll send you instructions to reset your password.
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="alert-error-box">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {message && (
                        <div className="alert-success-box" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.85rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--accent-emerald-light)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            color: 'var(--accent-emerald)',
                            fontSize: '0.88rem',
                            fontWeight: 500
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span>{message}</span>
                        </div>
                    )}

                    <div className="auth-form-group">
                        <label htmlFor="forgot-email" className="auth-label">
                            Email Address
                        </label>
                        <div className="auth-input-wrapper">
                            <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect width="20" height="16" x="2" y="4" rx="2"/>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                            </svg>
                            <input
                                id="forgot-email"
                                className="auth-input"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                    setMessage("");
                                }}
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <button
                        className="btn btn-primary auth-submit-btn"
                        type="submit"
                        disabled={loading || !email.trim()}
                    >
                        {loading ? "Sending Reset Link..." : "Send Reset Link"}
                    </button>

                    <div className="auth-footer-text">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            style={{ margin: "0 auto", fontSize: "0.9rem" }}
                            onClick={handleBack}
                        >
                            ← Back to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;