import React, { StrictMode } from "react";
import { Route } from "react-router-dom";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import { UIHomePage } from "./pages/home/UIHome";
import { UIFamilyTree } from "./pages/family-tree/UIFamilyTree";

export function MyApp() {
  return (
    <StrictMode>
      <RecoilRoot>
        <App>
          <SnackbarProvider>
            <ZMPRouter>
              <AnimationRoutes>
                <Route path="/" element={<UIHomePage/>}/>
                <Route path="/ftree" element={<UIFamilyTree/>}/>
              </AnimationRoutes>
            </ZMPRouter>
          </SnackbarProvider>
        </App>
      </RecoilRoot>
    </StrictMode>
  );
};