import React from "react";
import { RecoilRoot } from "recoil";
import { App, ZMPRouter, SnackbarProvider } from "zmp-ui";

import UILayout from "./layout";

import "../i18n";

function Application() {
  return (
    <RecoilRoot>
      <App>
        <SnackbarProvider>
          <ZMPRouter>
            <UILayout/>
          </ZMPRouter>
        </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
};

export default Application;