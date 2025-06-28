import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to analytics or service if needed
    if (window.gtag) {
      window.gtag("event", "exception", {
        description: error?.toString(),
        fatal: false,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-red-600">
          <h1 className="text-2xl font-bold mb-2">Something went wrong.</h1>
          <pre className="text-xs">{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
