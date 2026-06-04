import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "red", background: "white", fontFamily: "monospace" }}>
          <h2>Error en la aplicacion:</h2>
          <pre>{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

try {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} catch (e) {
  document.getElementById("root").innerHTML =
    '<div style="padding:20px;color:red;background:white;font-family:monospace"><h2>Error critico:</h2><pre>' +
    String(e) +
    "</pre></div>";
}
