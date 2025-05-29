import React, { Component } from "react";
import "./ErrorBoundary.css";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return React.createElement('div', { className: 'error-boundary glass-effect' },
        React.createElement('h2', { className: 'gradient-text' }, 'Something went wrong.'),
        React.createElement('p', null, 'Please try refreshing the page.'),
        React.createElement('button', {
          className: 'btn-primary',
          onClick: () => window.location.reload()
        }, 'Refresh')
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
