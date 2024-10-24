import React, { StrictMode } from "react";
import { Route } from "react-router-dom";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import HomePage from "pages/home/UIHome";
import About from "pages/about";
import Form from "pages/form";
import User from "pages/user";

export function MyApp() {
  return (
    <StrictMode>
      <RecoilRoot>
        <App>
          <SnackbarProvider>
            <ZMPRouter>
              <AnimationRoutes>
                <Route path="/" element={<HomePage></HomePage>}></Route>
                {/* <Route path="/about" element={<About></About>}></Route>
                <Route path="/form" element={<Form></Form>}></Route>
                <Route path="/user" element={<User></User>}></Route> */}
              </AnimationRoutes>
            </ZMPRouter>
          </SnackbarProvider>
        </App>
      </RecoilRoot>
    </StrictMode>
  );
};