import React, { useState, useEffect, useRef } from 'react';
import './Card.css';

const Section = ({ title, description, onClick, onDelete }) => {


    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMenuClick = (e) => {
        e.stopPropagation(); // Prevent card click when clicking menu
        setShowMenu(!showMenu);
    };

    const handleDelete = (e) => {
        e.stopPropagation(); // Prevent card click when clicking delete
        onDelete();
        setShowMenu(false);
    };

    return (
        <div className="classroom-card" onClick={onClick}>
            <div className="card-content">
                <div className="card-header">
                    <h3 className="card-title">{title}</h3>
                    <div className="card-menu" ref={menuRef}>
                        <button className="menu-button" onClick={handleMenuClick}>
                            <span className="menu-dots">⋮</span>
                        </button>
                        {showMenu && (
                            <div className="menu-dropdown">
                                <button className="menu-item delete" onClick={handleDelete}>
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {description && <p className="card-description">{description}</p>}
            </div>
        </div>
    );
};

export default Section;
