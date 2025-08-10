import React from 'react';
import { createRoot } from 'react-dom/client';

// Simple test component first
const TestApp = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0D1117',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', padding: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#0055FF' }}>
          🚀 AI Campaign Strategist
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#C9D1D9' }}>
          Premium Viral Content Generation Platform
        </p>
        <div style={{
          background: '#161B22',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #21262D'
        }}>
          <h2 style={{ color: '#F0F6FC', marginBottom: '15px' }}>✅ App Successfully Loaded!</h2>
          <p style={{ color: '#8B949E', marginBottom: '20px' }}>
            The deployment is working. The full app will be loaded next.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #0055FF 0%, #8A2BE2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Load Full App
          </button>
        </div>
        <div style={{ marginTop: '30px', fontSize: '14px', color: '#8B949E' }}>
          <p>🎯 Advanced Psychological Triggers</p>
          <p>📊 Multi-Platform Optimization</p>
          <p>🔥 Viral Content Engine</p>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<TestApp />);
} else {
  document.body.innerHTML = '<h1 style="color: red;">Root element not found!</h1>';
}
