// React core
import React from "react";
import { createRoot } from "react-dom/client";

// Tailwind stylesheet
import "css/tailwind.scss";

// ZaUI stylesheet
import "zmp-ui/zaui.css";

// Your stylesheet
import "css/app.scss";

// Expose app configuration
import appConfig from "../app-config.json";
if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig;
}

// Mount the app
import { MyApp } from "./main";
const root = createRoot(document.getElementById("root")!);
root.render(React.createElement(MyApp));
