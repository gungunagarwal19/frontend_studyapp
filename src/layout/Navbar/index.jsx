import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../store/User/UserAction";
import { clearSections } from "../../../store/Section/SectionReducer";  // Add this import
import Loading from "../../components/Loading";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user, loading, authChecked } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(clearSections());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!authChecked) {
    return null; 
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Learnmate
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/about" className="nav-link">
              About
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/signup" className="nav-link">
                  Sign Up
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 