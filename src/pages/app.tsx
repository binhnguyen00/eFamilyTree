import React from "react";
import { RecoilRoot } from "recoil";
import { App, ZMPRouter, SnackbarProvider, AnimationRoutes } from "zmp-ui";

import UILayout from "./layout";

import "../i18n";

function Application() {
  return (
    <RecoilRoot>
      <App theme="light">
        <SnackbarProvider>
            <ZMPRouter memoryRouter>
              <UILayout/>
            </ZMPRouter>
        </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
};

export default Application;