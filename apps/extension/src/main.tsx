import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { getExtensionActionApi } from "@/lib/extensionApi";

// Clear any completion badge as soon as the popup opens
const actionApi = getExtensionActionApi();
if (actionApi?.setBadgeText) {
  void actionApi.setBadgeText({ text: "" });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
