// src/components/ErrorBoundary.jsx - FULLY RESPONSIVE

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-3 xs:p-4">
          <div className="max-w-sm xs:max-w-md w-full bg-white shadow-lg rounded-lg xs:rounded-xl p-5 xs:p-6 text-center">
            <div className="w-12 h-12 xs:w-16 xs:h-16 mx-auto mb-3 xs:mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-6 h-6 xs:w-8 xs:h-8 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            <h2 className="text-lg xs:text-xl font-semibold text-gray-900 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-sm xs:text-base text-gray-600 mb-5 xs:mb-6">
              We're sorry for the inconvenience. Please refresh the page and try again.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-2 xs:py-2.5 px-4 rounded-md transition duration-200 text-sm xs:text-base"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
