import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { App, SnackbarProvider } from "zmp-ui";

import { UIRoutes } from "./routes";
import { Navigation, ThemeProvider } from "components";

import "../i18n";
import { PagePositionSaver } from "components/common/PagePositionSaver";

function Application() {
  return (
    <RecoilRoot>
      <App>
        <ThemeProvider>
          <SnackbarProvider>
            <Router>
              <PagePositionSaver />
              <UIRoutes/>
              <Navigation/>
            </Router>
          </SnackbarProvider>
        </ThemeProvider>
      </App>
    </RecoilRoot>
  );
};

export default Application;