import React from "react";
import { RecoilRoot } from "recoil";
import { App, ZMPRouter, SnackbarProvider } from "zmp-ui";
import "../i18n";

import UILayout from "./layout";
import UISwipeGesture from "components/common/UISwipeGesture";

function Application() {
  return (
    <RecoilRoot>
      <App>
        <SnackbarProvider>
          <ZMPRouter>
            <UISwipeGesture>
              <UILayout/>
            </UISwipeGesture>
          </ZMPRouter>
        </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
};

export default Application;