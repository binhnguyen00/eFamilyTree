import React, { StrictMode } from "react";
import { Route } from "react-router-dom";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import { UIHomePage } from "./home/UIHome";
import { UIFamilyTree } from "./family-tree/UIFamilyTree";
import { UIAbout } from "./about/UIAbout";
import { UIDummyUserForm } from "./dummy/UIDummyUser";
import { UIDummyAlbum } from "./dummy/UIDummyAlbum";
import { UIDummyCalendar } from "./dummy/UIDummyCalendar";
import { UIDummyUpcoming } from "./dummy/UIDummyUpcoming";

export function Application() {
  return (
    <StrictMode>
      <RecoilRoot>
        <App theme="light">
          <SnackbarProvider>
            <ZMPRouter>
              <AnimationRoutes>
                <Route path="/" element={<UIHomePage/>}/>
                <Route path="/family-tree" element={<UIFamilyTree/>}/>
                <Route path="/about" element={<UIAbout/>}/>
                <Route path="/user" element={<UIDummyUserForm/>}/>
                <Route path="/album" element={<UIDummyAlbum/>}/>
                <Route path="/calendar" element={<UIDummyCalendar/>}/>
                <Route path="/upcoming" element={<UIDummyUpcoming/>}/>
              </AnimationRoutes>
            </ZMPRouter>
          </SnackbarProvider>
        </App>
      </RecoilRoot>
    </StrictMode>
  );
};