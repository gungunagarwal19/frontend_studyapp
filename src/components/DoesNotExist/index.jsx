import React from 'react';

const DoesNotExist = ({ message = "Sorry, this page or resource does not exist." }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    color: '#d93025',
    fontSize: '1.3rem',
    fontWeight: 500
  }}>
    <span role="img" aria-label="not found" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</span>
    <div>{message}</div>
  </div>
);

export default DoesNotExist;
