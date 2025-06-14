/**
 * Error Boundary Component
 *
 * Catches JavaScript errors in the component tree and displays
 * a fallback UI instead of crashing the entire application.
 *
 * Follows React best practices for error handling.
 */

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // You could also log the error to an error reporting service here
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6">
                <div className="card border-danger">
                  <div className="card-header bg-danger text-white">
                    <h4 className="mb-0">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Oops! Something went wrong
                    </h4>
                  </div>
                  <div className="card-body">
                    <p className="card-text">
                      We encountered an unexpected error. Don't worry, our team
                      has been notified.
                    </p>

                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                      >
                        <i className="fas fa-refresh me-2"></i>
                        Refresh Page
                      </button>

                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => window.history.back()}
                      >
                        <i className="fas fa-arrow-left me-2"></i>
                        Go Back
                      </button>
                    </div>

                    {process.env.NODE_ENV === 'development' && (
                      <details className="mt-3">
                        <summary className="text-muted small">
                          Error Details (Development Mode)
                        </summary>
                        <pre className="small mt-2 p-2 bg-light border rounded">
                          {this.state.error && this.state.error.toString()}
                          <br />
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
