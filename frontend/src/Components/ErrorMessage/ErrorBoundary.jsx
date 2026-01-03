import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    if (this.props.onError) this.props.onError(error, errorInfo);
    if (process.env.NODE_ENV !== "production") {
      // muestra en consola solo en dev
      // eslint-disable-next-line no-console
      console.error(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) this.props.onReset();
  };

  renderFallback() {
    const { fallback } = this.props;
    if (fallback) {
      return typeof fallback === "function"
        ? fallback({ error: this.state.error, reset: this.handleReset })
        : fallback;
    }

    return (
      <div
        style={{
          padding: 20,
          borderRadius: 6,
          border: "1px solid #f5c2c7",
          background: "#fff5f6",
          color: "#611",
        }}
      >
        <h3 style={{ margin: 0 }}>Algo salió mal.</h3>
        {this.state.error && (
          <details style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>
            {this.state.error.toString()}
            {this.state.errorInfo
              ? "\n" + this.state.errorInfo.componentStack
              : ""}
          </details>
        )}
        <div style={{ marginTop: 12 }}>
          <button onClick={this.handleReset} style={{ marginRight: 8 }}>
            Reintentar
          </button>
          <button onClick={() => window.location.reload()}>
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.renderFallback();
    }
    return this.props.children || null;
  }
}

export default ErrorBoundary;
