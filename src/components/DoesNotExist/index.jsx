import React from 'react';
import { Link } from 'react-router-dom';

const DoesNotExist = ({ message = "Sorry, this page or resource does not exist." }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    padding: '3rem 1.5rem',
    textAlign: 'center',
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '68px',
      height: '68px',
      borderRadius: 'var(--radius-full)',
      backgroundColor: 'var(--accent-rose-light)',
      color: 'var(--accent-rose)',
      marginBottom: '1.25rem',
    }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    </div>
    <h2 style={{
      fontSize: '1.5rem',
      fontWeight: 700,
      color: 'var(--text-primary)',
      marginBottom: '0.5rem',
    }}>
      Resource Not Found
    </h2>
    <p style={{
      fontSize: '1rem',
      color: 'var(--text-secondary)',
      maxWidth: '420px',
      lineHeight: '1.6',
      marginBottom: '1.5rem',
    }}>
      {message}
    </p>
    <Link to="/" className="btn btn-primary">
      Return to Dashboard
    </Link>
  </div>
);

export default DoesNotExist;
