import React from "react";
import { Box } from "zmp-ui";
import { Route, Routes } from "react-router-dom";
import { getSystemInfo } from "zmp-sdk/apis";
import { UIBlogDetail } from "./blog/UIBlogDetail";
import { UIDeveloper } from "./dummy/UIDeveloper";
import { UIDummyUpcoming } from "./dummy/UIDummyUpcoming";
import { UICalendar } from "./calendar/UICalendar";
import { UIFund, UIFundDetail } from "./fund/UIFund";
import { UIDummyFund, UIDummyFundDetail } from "./dummy/UIDummyFund";
import { UIDummyTree } from "./dummy/UIDummyTree";
import { UIDummyCalendar } from "./dummy/UIDummyCalendar";
import { UIDummyBlog } from "./dummy/UIDummyBlog";
import { UIDummyAlbum } from "./dummy/UIDummyAlbum";
import { UIPlayground } from "./dummy/UIPlayground";
import { UIDummyNavigate } from "./dummy/UIDummyNavigate";
import { UIFamilyTree } from "./family-tree/UIFamilyTree";
import { UIFamilyMember } from "./family-tree/UIFamilyMember";
import { UIAbout } from "./about/UIAbout";
import { UIUserDetail } from "./user/UIUser";
import { UIAlbum } from "./album/UIAlbum";
import { UIBlog } from "./blog/UIBlog";

import { t } from "i18next";

import { CommonComponentUtils } from "components/common/CommonComponentUtils";

import UIHomePage from "./home/UIHome";
import UINavigation from "components/common/UINavigation";

function UILayout() { 
  return (
    <Box flex flexDirection="column">
      <Box className="flex-1 flex flex-col overflow-hidden">
        <Routes>
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
        </Routes>
      </Box>

      <UINavigation/>
    </Box>
  )
}

export default UILayout;