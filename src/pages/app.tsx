import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { App, SnackbarProvider } from "zmp-ui";

import { UIRoutes } from "./routes";
import { Navigation, ThemeProvider, PagePositionSaver } from "components";

import "../i18n";

function Application() {
  return (
    <RecoilRoot>
      <App>
        <ThemeProvider>
          <SnackbarProvider>
            <Router>
              <UIRoutes/>
              <Navigation/>
              <PagePositionSaver />
            </Router>
          </SnackbarProvider>
        </ThemeProvider>
      </App>
    </RecoilRoot>
  );
};

export default Application;