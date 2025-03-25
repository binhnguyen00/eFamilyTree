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
        <ThemeProvider>
          <OverlayProvider>
            <ApplicationProvider>
              <NotificationProvider>
                <RequestPhoneProvider>
                  <RequestLocationProvider>
                    <AccountProvider>
                      <AppRoutes/>
                      <Navigation/>
                      <PagePositionSaver />
                    </AccountProvider>
                  </RequestLocationProvider>
                </RequestPhoneProvider>
              </NotificationProvider>
            </ApplicationProvider>
          </OverlayProvider>
        </ThemeProvider>
      </Router>
    </ZaloApp>
  );
};

export default Application;