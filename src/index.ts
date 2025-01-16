// React core
import React from "react";
import { createRoot } from "react-dom/client";

// Custom stylesheet
import "./css/tailwind.scss";
import "./css/album.scss";
import "./css/family-tree.scss";
import "./css/font/font.scss";
import "./css/bootstrap.scss";
import "./css/app.scss";

// ZaUI stylesheet
import "zmp-ui/zaui.css";

// Expose app configuration
import appConfig from "../app-config.json";
if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig;
}

// Mount the app
import Application from "./pages/app";
const root = createRoot(document.getElementById("app")!);
root.render(React.createElement(Application));