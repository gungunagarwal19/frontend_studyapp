import React, { useState, useEffect, useRef } from "react";
import "./Card.css";

const Section = ({ title, description, onClick, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
    setShowMenu(false);
  };

  // Generate consistent subtle accent color based on title length
  const accentColors = [
    "accent-blue",
    "accent-indigo",
    "accent-purple",
    "accent-emerald",
    "accent-amber",
  ];
  const colorIndex = (title?.length || 0) % accentColors.length;
  const accentClass = accentColors[colorIndex];

  return (
    <div
      className={`study-section-card ${accentClass}`}
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Open section ${title}`}
    >
      <div className="card-top-accent"></div>

      <div className="card-inner">
        <div className="card-header-row">
          <div className="card-icon-badge">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>

          <div className="card-menu" ref={menuRef}>
            <button
              className="menu-button"
              onClick={handleMenuClick}
              aria-label="Section options"
              aria-expanded={showMenu}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>

            {showMenu && (
              <div className="menu-dropdown" role="menu">
                <button
                  className="menu-item delete"
                  onClick={handleDelete}
                  role="menuitem"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Delete Section
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="card-main-content">
          <h3 className="section-card-title">{title}</h3>
          <p className="section-card-description">
            {description || "No description provided. Click to open materials and flashcards."}
          </p>
        </div>

        <div className="card-footer-action">
          <span className="card-action-label">Open Workspace</span>
          <svg
            className="arrow-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Section;
