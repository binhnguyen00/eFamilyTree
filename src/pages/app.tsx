import React from "react";
import { RecoilRoot } from "recoil";
import { App, ZMPRouter, SnackbarProvider } from "zmp-ui";
import "../i18n";

import UIRoutes from "./routes";

function Application() {
  return (
    <RecoilRoot>
      <App>
        <SnackbarProvider>
          <ZMPRouter memoryRouter>
            <UIRoutes/>
          </ZMPRouter>
        </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
};

export default Application;