import React from "react";
import { Route } from "react-router-dom";
import { atom, RecoilRoot, selector } from "recoil";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { UIHomePage } from "./home/UIHome";
import { UIFamilyTree } from "./family-tree/UIFamilyTree";
import { UIAbout } from "./about/UIAbout";
import { UIDummyAlbum } from "./dummy/UIDummyAlbum";
import { UIDummyUpcoming } from "./dummy/UIDummyUpcoming";
import { UIPlayground } from "./dummy/UIPlayground";
import { UIUserDetail } from "./user/UIUser";
import { UIDummyTree } from "./dummy/UIDummyTree";
import { UIBlog } from "./blog/UIBlog";
import { UIBlogDetail } from "./blog/UIBlogDetail";
import { UICalendar } from "./calendar/UICalendar";
import { UIDummyCalendar } from "./dummy/UIDummyCalendar";
import { UIDummyBlog } from "./dummy/UIDummyBlog";
import { UIFund, UIFundDetail } from "./fund/UIFund";
import { UIDummyFund, UIDummyFundDetail } from "./dummy/UIDummyFund";

import "../i18n";

export function Application() {
  return (
    <RecoilRoot>
      <App theme="light">
        <SnackbarProvider>
          <ZMPRouter>
            <AnimationRoutes>
              <Route path="/" element={<UIHomePage/>}/>
              <Route path="/family-tree" element={<UIFamilyTree/>}/>
              <Route path="/about" element={<UIAbout/>}/>
              <Route path="/user" element={<UIUserDetail/>}/>
              <Route path="/album" element={<UIDummyAlbum/>}/>
              <Route path="/calendar" element={<UICalendar/>}/>
              <Route path="/upcoming" element={<UIDummyUpcoming/>}/>
              <Route path="/playground" element={<UIPlayground/>}/>
              <Route path="/blogs" element={<UIBlog/>}/>
              <Route path="/funds" element={<UIFund/>}/>
              <Route path="/fund-detail" element={<UIFundDetail/>}/>
              <Route path="/blog-detail" element={<UIBlogDetail/>}/>
              <Route path="/demo-funds" element={<UIDummyFund/>}/>
              <Route path="/demo-fund-detail" element={<UIDummyFundDetail/>}/>
              <Route path="/demo-tree" element={<UIDummyTree/>}/>
              <Route path="/demo-calendar" element={<UIDummyCalendar/>}/>
              <Route path="/demo-blogs" element={<UIDummyBlog/>}/>
            </AnimationRoutes>
          </ZMPRouter>
        </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
};