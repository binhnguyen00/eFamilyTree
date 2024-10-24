import React, { StrictMode } from "react";
import { Route } from "react-router-dom";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import { UIHomePage } from "./home/UIHome";
import { UIFamilyTree } from "./family-tree/UIFamilyTree";
import { UIAbout } from "./about/UIAbout";
import { UIDummyUserForm } from "./dummy/UIDummyUser";

export function Application() {
  return (
    <StrictMode>
      <RecoilRoot>
        <App>
          <SnackbarProvider>
            <ZMPRouter>
              <AnimationRoutes>
                <Route path="/" element={<UIHomePage/>}/>
                <Route path="/family-tree" element={<UIFamilyTree/>}/>
                <Route path="/about" element={<UIAbout/>}/>
                <Route path="/user" element={<UIDummyUserForm/>}/>
              </AnimationRoutes>
            </ZMPRouter>
          </SnackbarProvider>
        </App>
      </RecoilRoot>
    </StrictMode>
  );
};