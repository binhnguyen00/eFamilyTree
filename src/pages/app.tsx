import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { App as ZaloApp } from "zmp-ui";

import { AppRoutes } from "./routes";
import { 
  Navigation, PagePositionSaver,
  ThemeProvider, ApplicationProvider, NotificationProvider
} from "components";

import "../i18n";

function Application() {
  return (
    <React.StrictMode>
      <ZaloApp>
        <ThemeProvider>
          <ApplicationProvider>
            <NotificationProvider>
              <Router>
                <AppRoutes/>
                <Navigation/>
                <PagePositionSaver />
              </Router>
            </NotificationProvider>
          </ApplicationProvider>
        </ThemeProvider>
      </ZaloApp>
    </React.StrictMode>
  );
};

export default Application;