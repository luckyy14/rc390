import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./layouts/ThemeProvider";
import { ErrorBoundary } from "./layouts/ErrorBoundary";
import { QueryProvider } from "./layouts/QueryProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
