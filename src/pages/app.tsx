import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { App as ZaloApp } from "zmp-ui";

import { AppRoutes } from "./routes";
import { 
  Navigation, PagePositionSaver,
  ThemeProvider, ApplicationProvider, NotificationProvider
} from "components";

import "../i18n";
import { AccountProvider } from "components/provider/AccountProvider";

function Application() {
  return (
    <ZaloApp>
      <ThemeProvider>
        <ApplicationProvider>
          <NotificationProvider>
              <Router>
                <AccountProvider>
                  <AppRoutes/>
                  <Navigation/>
                  <PagePositionSaver />
                </AccountProvider>
              </Router>
          </NotificationProvider>
        </ApplicationProvider>
      </ThemeProvider>
    </ZaloApp>
  );
};

export default Application;