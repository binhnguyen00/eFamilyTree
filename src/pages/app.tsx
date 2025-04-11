import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { App as ZaloApp } from "zmp-ui";
import "zmp-ui/zaui.min.css";

import { AppRoutes } from "./routes";
import { 
  Navigation, PagePositionSaver,
  ThemeProvider, ApplicationProvider, NotificationProvider,
  RequestPhoneProvider, RequestLocationProvider, OverlayProvider, AccountProvider,
  ChatBotProvider,
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
                      <ChatBotProvider>
                        <AppRoutes/>
                        <Navigation/>
                        <PagePositionSaver />
                      </ChatBotProvider>
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