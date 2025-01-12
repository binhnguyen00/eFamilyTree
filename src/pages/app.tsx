import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { App as ZaloApp } from "zmp-ui";

import { AppRoutes } from "./routes";
import { 
  Navigation, 
  PagePositionSaver,
  ThemeProvider, ApplicationProvider 
} from "components";

import "../i18n";

function Application() {
  return (
    <React.StrictMode>
      <ZaloApp>
        <ThemeProvider>
          <ApplicationProvider>
            <Router>
              <AppRoutes/>
              <Navigation/>
              <PagePositionSaver />
            </Router>
          </ApplicationProvider>
        </ThemeProvider>
        <ToastContainer/>
      </ZaloApp>
    </React.StrictMode>
  );
};

export default Application;