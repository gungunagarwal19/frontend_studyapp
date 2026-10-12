import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../store/User/UserAction";
import { clearSections } from "../../../store/Section/SectionReducer";
import { useTheme } from "../../context/ThemeContext";
import Loading from "../../components/Loading";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const { isAuthenticated, user, loading, authChecked } = useSelector((state) => state.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(clearSections());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  if (!authChecked) {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "U");

  return (
    <header className="navbar-header">
      <nav className="navbar-container" aria-label="Main Navigation">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" aria-label="Learnmate Home">
          <div className="brand-icon-wrapper">
            <svg
              className="brand-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10" />
              <path d="M6 10h10" />
              <path d="M6 14h6" />
            </svg>
          </div>
          <span className="brand-name">Learnmate</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="navbar-desktop-nav">
          <ul className="nav-links-list">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${isActive("/") ? "active" : ""}`}
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/about"
                className={`nav-link ${isActive("/about") ? "active" : ""}`}
              >
                About
              </Link>
            </li>
          </ul>

          {/* Right Action Area */}
          <div className="navbar-actions">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <svg
                  className="theme-icon moon-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              ) : (
                <svg
                  className="theme-icon sun-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              )}
            </button>

            {isAuthenticated ? (
              <div className="user-profile-controls">
                <Link
                  to="/profile"
                  className={`profile-chip ${isActive("/profile") ? "active" : ""}`}
                  aria-label="User Profile"
                >
                  <span className="avatar-initial">{userInitial}</span>
                  <span className="user-name-text">{user?.name || "Profile"}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-logout"
                  aria-label="Log out"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="auth-buttons-group">
                <Link to="/login" className="nav-btn btn-ghost-link">
                  Login
                </Link>
                <Link to="/signup" className="nav-btn btn-primary-link">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Actions: Theme button + Hamburger */}
        <div className="navbar-mobile-actions">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn mobile-theme-btn"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <svg
                className="theme-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            ) : (
              <svg
                className="theme-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            )}
          </button>

          <button
            className={`hamburger-btn ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true">
          <ul className="mobile-nav-list">
            <li>
              <Link
                to="/"
                className={`mobile-nav-link ${isActive("/") ? "active" : ""}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`mobile-nav-link ${isActive("/about") ? "active" : ""}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
                <span>About</span>
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    className={`mobile-nav-link ${isActive("/profile") ? "active" : ""}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>Profile ({user?.name || "User"})</span>
                  </Link>
                </li>
                <li className="mobile-action-item">
                  <button onClick={handleLogout} className="mobile-logout-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <div className="mobile-auth-group">
                <Link to="/login" className="btn btn-secondary mobile-auth-btn">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary mobile-auth-btn">
                  Sign Up
                </Link>
              </div>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;