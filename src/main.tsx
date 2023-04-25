import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./assets/styles/normalize.css";
import "./assets/styles/index.css";
import { ThemeContextProvider } from "./context/ThemeContext";
import DataContextProvider from "./context/DataContext";

ReactDOM.createRoot(document.querySelector(".container") as HTMLElement).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <DataContextProvider>
        <App />
      </DataContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>
);
