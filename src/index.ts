// React core
import React from "react";
import { createRoot } from "react-dom/client";

// Tailwind stylesheet
import "./css/tailwind.scss";
import "./css/stylesheet.scss";

// ZaUI stylesheet
import "zmp-ui/zaui.css";

// Expose app configuration
import appConfig from "../app-config.json";
if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig;
}

// Mount the app
import { Application } from "./pages/main";
const root = createRoot(document.getElementById("app")!);
root.render(React.createElement(Application));