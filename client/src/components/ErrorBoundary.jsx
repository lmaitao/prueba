import { Component } from 'react';
import { Alert } from 'react-bootstrap';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="danger" className="m-3">
          <Alert.Heading>Algo salió mal</Alert.Heading>
          <div className="error-message">
            Por favor recarga la página o intenta nuevamente más tarde.
            {process.env.NODE_ENV === 'development' && (
              <div className="error-details mt-2">
                <details>
                  <summary>Detalles del error</summary>
                  <pre className="small">
                    {this.state.error?.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;