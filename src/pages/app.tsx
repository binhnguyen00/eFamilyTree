import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { App as ZaloApp, SnackbarProvider } from "zmp-ui";

import { AppRoutes } from "./routes";
import { 
  Navigation, 
  PagePositionSaver,
  ThemeProvider, ApplicationProvider 
} from "components";

import "../i18n";

function Application() {
  return (
    <ZaloApp>
      <SnackbarProvider zIndex={999}>
        <ThemeProvider>
          <ApplicationProvider>
            <Router>
              <AppRoutes/>
              <Navigation/>
              <PagePositionSaver />
            </Router>
          </ApplicationProvider>
        </ThemeProvider>
      </SnackbarProvider>
    </ZaloApp>
  );
};

export default Application;