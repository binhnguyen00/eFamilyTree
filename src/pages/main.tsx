import React from "react";
import { t } from "i18next";
import { Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { UIHomePage } from "./home/UIHome";
import { UIFamilyTree } from "./family-tree/UIFamilyTree";
import { UIAbout } from "./about/UIAbout";
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
import { UIDeveloper } from "./dummy/UIDeveloper";
import { CommonComponentUtils } from "components/common/CommonComponentUtils";
import { UIDummyNavigate } from "./dummy/UIDummyNavigate";
import { UIFamilyMember } from "./family-tree/UIFamilyMember";
import { UIAlbum } from "./album/UIAlbum";
import { UIDummyAlbum } from "./dummy/UIDummyAlbum";

import "../i18n";

export function Application() {
  return (
    <RecoilRoot>
      <App theme="light">
        <SnackbarProvider>
          <ZMPRouter>
            <AnimationRoutes>
              <Route path="/" element={<UIHomePage/>}/>

              <Route path="/family-tree" element={
                <React.Suspense fallback={
                  <div style={{ height: "100vh" }}> 
                    {CommonComponentUtils.renderLoading(t("loading_family_tree"))} 
                  </div>
                }>
                  <UIFamilyTree/>
                </React.Suspense>
              }/>
              <Route path="/family-member-info" element={
                <React.Suspense fallback={
                  <div style={{ height: "100vh" }}> 
                    {CommonComponentUtils.renderLoading(t("loading"))} 
                  </div>
                }> 
                  <UIFamilyMember /> 
                </React.Suspense>}
              />
              
              <Route path="/about" element={<UIAbout/>}/>

              <Route path="/user" element={<UIUserDetail/>}/>

              <Route path="/album" element={
                <React.Suspense fallback={
                  <div style={{ height: "100vh" }}>
                    {CommonComponentUtils.renderLoading(t("loading_album"))}
                  </div>
                }>
                  <UIAlbum/>
                </React.Suspense>
              }/>

              <Route path="/calendar" element={
                <React.Suspense fallback={
                  <div style={{ height: "100vh" }}>
                    {CommonComponentUtils.renderLoading(t("loading_calendar"))}
                  </div>
                }>
                  <UICalendar/>
                </React.Suspense>
              }/>

              <Route path="/upcoming" element={<UIDummyUpcoming/>}/>

              <Route path="/developer" element={<UIDeveloper/>}/>

              <Route path="/blogs" element={
                <React.Suspense fallback={
                  <div style={{ height: "100vh" }}>
                    {CommonComponentUtils.renderLoading(t("loading_blogs"))}
                  </div>
                }>
                  <UIBlog/>
                </React.Suspense>
              }/>
              <Route path="/blog-detail" element={<UIBlogDetail/>}/>

              <Route path="/funds" element={
                <React.Suspense fallback={
                  <div style={{ height: "100vh" }}>
                    {CommonComponentUtils.renderLoading(t("loading_funds"))}
                  </div>
                }>
                  <UIFund/>
                </React.Suspense>
              }/>
              <Route path="/fund-detail" element={<UIFundDetail/>}/>

              <Route path="/demo-funds" element={<UIDummyFund/>}/>
              <Route path="/demo-fund-detail" element={<UIDummyFundDetail/>}/>
              <Route path="/demo-tree" element={<UIDummyTree/>}/>
              <Route path="/demo-calendar" element={<UIDummyCalendar/>}/>
              <Route path="/demo-blogs" element={<UIDummyBlog/>}/>
              <Route path="/demo-album" element={<UIDummyAlbum/>}/>

              <Route path="/playground" element={<UIPlayground/>}/>
              <Route path="/dummy-detail" element={<UIDummyNavigate/>}/>

            </AnimationRoutes>
          </ZMPRouter>
        </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
};