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
      <ThemeProvider>
        <OverlayProvider>
          <ApplicationProvider>
            <NotificationProvider>
              <Router>
                <RequestPhoneProvider>
                  <RequestLocationProvider>
                    <AccountProvider>
                      <AppRoutes/>
                      <Navigation/>
                      <PagePositionSaver />
                    </AccountProvider>
                  </RequestLocationProvider>
                </RequestPhoneProvider>
              </Router>
            </NotificationProvider>
          </ApplicationProvider>
        </OverlayProvider>
      </ThemeProvider>
    </ZaloApp>
  );
};

export default Application;