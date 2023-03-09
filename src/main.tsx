import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./index.css";

ReactDOM.createRoot(document.querySelector(".wrapper") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
