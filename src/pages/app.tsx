import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { App as ZaloApp } from "zmp-ui";
import "zmp-ui/zaui.min.css";
import "react-photo-view/dist/react-photo-view.css";

import { AppRoutes } from "./routes";
import { 
  Navigation,
  ThemeProvider, ApplicationProvider, NotificationProvider,
  RequestPhoneProvider, RequestLocationProvider, OverlayProvider, AccountProvider,
  ChatBotProvider,
} from "components";

import "../i18n";

export function Application() {
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