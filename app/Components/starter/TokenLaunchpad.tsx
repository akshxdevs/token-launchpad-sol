'use client';

import React from 'react';

export function TokenLaunchpad() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#0f172a',
        color: 'white',
        fontFamily: 'sans-serif',
        padding: 24,
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Solana Token Launchpad</h1>

      <input className="inputText" type="text" placeholder="Name" style={inputStyle} />
      <input className="inputText" type="text" placeholder="Symbol" style={inputStyle} />
      <input className="inputText" type="text" placeholder="Image URL" style={inputStyle} />
      <input className="inputText" type="text" placeholder="Initial Supply" style={inputStyle} />

      <button className="btn" style={buttonStyle}>Create a token</button>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  marginBottom: 12,
  padding: '10px 12px',
  width: 280,
  borderRadius: 6,
  border: '1px solid #334155',
  backgroundColor: '#1e293b',
  color: 'white',
  fontSize: 16,
};

const buttonStyle: React.CSSProperties = {
  marginTop: 16,
  padding: '10px 20px',
  backgroundColor: '#6366f1',
  border: 'none',
  borderRadius: 8,
  color: 'white',
  cursor: 'pointer',
};
