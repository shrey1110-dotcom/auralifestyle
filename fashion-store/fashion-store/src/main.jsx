// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ThemeProvider from "@/context/ThemeContext";
import StoreProvider from "@/context/StoreContext";
import "./index.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
