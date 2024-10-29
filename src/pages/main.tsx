import React from "react";
import { Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { ZmpSDK } from "../utils/ZmpSdk";
import { UIHomePage } from "./home/UIHome";
import { UIFamilyTree } from "./family-tree/UIFamilyTree";
import { UIAbout } from "./about/UIAbout";
import { UIDummyAlbum } from "./dummy/UIDummyAlbum";
import { UIDummyCalendar } from "./dummy/UIDummyCalendar";
import { UIDummyUpcoming } from "./dummy/UIDummyUpcoming";
import { UIPlayground } from "./dummy/UIPlayground";
import { UIUserHome } from "./user/UIUser";
import { UITree } from "./dummy/UITree";

export function Application() {
  // Get User's phone numb on init app. Get once, Zalo has cache.
  ZmpSDK.getPhoneNumber().then((result) => {
    console.log("Phone Number:", result);
  });

  return (
    <RecoilRoot>
      <App theme="light">
        <SnackbarProvider>
          <ZMPRouter>
            <AnimationRoutes>
              <Route path="/" element={<UIHomePage/>}/>
              <Route path="/family-tree" element={<UIFamilyTree/>}/>
              <Route path="/about" element={<UIAbout/>}/>
              <Route path="/user" element={<UIUserHome/>}/>
              <Route path="/album" element={<UIDummyAlbum/>}/>
              <Route path="/calendar" element={<UIDummyCalendar/>}/>
              <Route path="/upcoming" element={<UIDummyUpcoming/>}/>
              <Route path="/playground" element={<UIPlayground/>}/>
              <Route path="/demo-tree" element={<UITree/>}/>
            </AnimationRoutes>
          </ZMPRouter>
        </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
};