import React from "react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { App, SnackbarProvider } from "zmp-ui";

import { UIRoutes } from "./routes";
import { Navigation, ThemeProvider } from "components";

import "../i18n";

function Application() {
  return (
    <RecoilRoot>
      <App>
        <ThemeProvider>
          <SnackbarProvider>
              <BrowserRouter>
                <UIRoutes/>
                <Navigation/>
              </BrowserRouter>
          </SnackbarProvider>
        </ThemeProvider>
      </App>
    </RecoilRoot>
  );
};

export default Application;