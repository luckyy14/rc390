import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./layouts/ThemeProvider";
import { ErrorBoundary } from "./layouts/ErrorBoundary";
import { QueryProvider } from "./layouts/QueryProvider";
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <QueryProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </QueryProvider>
      </ErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>
);
