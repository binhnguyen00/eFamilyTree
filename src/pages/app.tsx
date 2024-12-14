import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { App, SnackbarProvider } from "zmp-ui";

import { UIRoutes } from "./routes";
import { Navigation, ThemeProvider, PagePositionSaver, AutoLoginProvider } from "components";

import "../i18n";

function Application() {
  return (
    <RecoilRoot>
      <App>
        <ThemeProvider>
          <SnackbarProvider>
            <AutoLoginProvider>
              <Router>
                <UIRoutes/>
                <Navigation/>
                <PagePositionSaver />
              </Router>
            </AutoLoginProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </App>
    </RecoilRoot>
  );
};

export default Application;