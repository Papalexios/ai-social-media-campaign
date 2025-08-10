import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Add loading indicator
const container = document.getElementById('root');
if (!container) {
  document.body.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #0D1117; color: white; font-family: Arial, sans-serif;">
      <div style="text-align: center;">
        <h1>Loading Error</h1>
        <p>Failed to find the root element</p>
      </div>
    </div>
  `;
  throw new Error('Failed to find the root element');
}

// Show loading state
container.innerHTML = `
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #0D1117; color: white; font-family: Arial, sans-serif;">
    <div style="text-align: center;">
      <div style="width: 40px; height: 40px; border: 4px solid #21262D; border-top: 4px solid #0055FF; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
      <h2>AI Campaign Strategist</h2>
      <p>Loading premium viral content engine...</p>
    </div>
  </div>
  <style>
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
`;

try {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error rendering app:', error);
  container.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #0D1117; color: white; font-family: Arial, sans-serif;">
      <div style="text-align: center;">
        <h1 style="color: #dc3545;">Render Error</h1>
        <p>Failed to render the application</p>
        <p style="font-size: 12px; color: #8B949E;">${error}</p>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #0055FF; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    </div>
  `;
}
