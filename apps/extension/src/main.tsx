import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Clear any completion badge as soon as the popup opens
if (typeof chrome !== "undefined" && chrome.action?.setBadgeText) {
  chrome.action.setBadgeText({ text: "" });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
