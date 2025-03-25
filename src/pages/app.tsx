import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { App as ZaloApp } from "zmp-ui";

import { AppRoutes } from "./routes";
import { 
  Navigation, PagePositionSaver,
  ThemeProvider, ApplicationProvider, NotificationProvider,
  RequestPhoneProvider, RequestLocationProvider, OverlayProvider, AccountProvider
} from "components";

import "../i18n";

function Application() {
  return (
    <ZaloApp>
      <Router>
        <OverlayProvider>
          <ApplicationProvider>
            <NotificationProvider>
              <ThemeProvider>
                <RequestPhoneProvider>
                  <RequestLocationProvider>
                    <AccountProvider>
                      <AppRoutes/>
                      <Navigation/>
                      <PagePositionSaver />
                    </AccountProvider>
                  </RequestLocationProvider>
                </RequestPhoneProvider>
              </ThemeProvider>
            </NotificationProvider>
          </ApplicationProvider>
        </OverlayProvider>
      </Router>
    </ZaloApp>
  );
};

export default Application;