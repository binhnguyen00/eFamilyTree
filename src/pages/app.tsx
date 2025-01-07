import React, { StrictMode } from "react";
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
    <React.StrictMode>
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
    </React.StrictMode>
  );
};

export default Application;