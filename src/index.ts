// React core
import React from "react";
import { createRoot } from "react-dom/client";

// ZaUI stylesheet
import "zmp-ui/zaui.css";

// Custom stylesheet
import "./css/font/font.scss";
import "./css/bootstrap.scss";
import "./css/stylesheet.scss";
import "./css/family-tree.scss";
import "./css/album.scss";
import "./css/app.scss";

// Expose app configuration
import appConfig from "../app-config.json";
if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig;
}

// Mount the app
import Application from "./pages/app";
const root = createRoot(document.getElementById("app")!);
root.render(React.createElement(Application));