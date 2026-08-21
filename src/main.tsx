import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { seedDevData } from "./mock/seedDev";
import "./index.css";

seedDevData();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
