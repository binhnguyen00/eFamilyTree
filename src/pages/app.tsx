import React from "react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { App, ZMPRouter, SnackbarProvider } from "zmp-ui";
import "../i18n";

import UIRoutes from "./routes";

import { ThemeProvider } from "components";

function Application() {
  return (
    <RecoilRoot>
      <App>
        <ThemeProvider>
          <SnackbarProvider>
            <BrowserRouter>
              <UIRoutes/>
            </BrowserRouter>
          </SnackbarProvider>
        </ThemeProvider>
      </App>
    </RecoilRoot>
  );
};

export default Application;