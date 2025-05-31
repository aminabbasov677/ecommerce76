import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { TrackingProvider } from './context/TrackingContext';

console.log('Starting application initialization...');

const isBrowserCompatible = () => {
  const requiredFeatures = [
    'fetch',
    'Promise',
    'localStorage',
    'sessionStorage',
    'IntersectionObserver',
    'ResizeObserver'
  ];

  return requiredFeatures.every(feature => feature in window);
};

const renderApp = () => {
  try {
    console.log('Attempting to render application...');
    if (!isBrowserCompatible()) {
      throw new Error('Your browser is not compatible with this application. Please use a modern browser.');
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    console.log('Root element found, rendering React application...');
    
    root.render(
      <React.StrictMode>
        <ThemeProvider>
          <AuthProvider>
            <TrackingProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </TrackingProvider>
          </AuthProvider>
        </ThemeProvider>
      </React.StrictMode>
    );
    console.log('React application rendered successfully');
  } catch (error) {
    console.error('Failed to render application:', error);
    document.getElementById('root').innerHTML = `
      <div class="error-container">
        <h1>Failed to load application</h1>
        <p>${error.message}</p>
        <button onclick="window.location.reload()" class="retry-button">Retry</button>
      </div>
    `;
  }
};

console.log('Calling renderApp...');
renderApp();