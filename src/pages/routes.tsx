import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import { Loading } from "components";

import { UIFamilyTree } from "pages/family-tree/UIFamilyTree";
import { UIUser } from "pages/user/UIUser";
import { UIHomeLayout } from "pages/home/UIHomeLayout";
import { UIAbout } from "pages/about/UIAbout";
import { UIImageList } from "./album/UIImageList";
import { UIRegisterClan } from "./user/UIRegisterClan";
import { UIRegister } from "./user/UIRegister";
import { UITheme } from "./theme/UITheme";
import { UIBlog } from "./blog/UIBlog";
import { UIBlogDetail } from "./blog/UIBlogDetail";
import { UIFund } from "./fund/UIFund";
import { UIFundDetail } from "./fund/UIFundDetail";
import { UICalendar } from "./calendar/UICalendar";
import { UIAlbum } from "./album/UIAlbum";
import { UIPlayground } from "./dummy/UIPlayground";
import { UIDeveloper } from "./dummy/UIDeveloper";
import { UIUpcomming } from "./upcomming/UIUpcomming";
import { UICerificateGroup } from "./certificate/UICertificateGroup";
import { UICertificate } from "./certificate/UICertificate";
import { UICertificateDetail } from "./certificate/UICertificateDetail";

// Demo components (React.lazy loaded)
const UIDummyFund = React.lazy(() => import("./dummy/UIDummyFund"));
const UIDummyFundDetail = React.lazy(() => import("./dummy/UIDummyFundDetail"));
const UIDummyTree = React.lazy(() => import("./dummy/UIDummyTree"));
const UIDummyCalendar = React.lazy(() => import("./dummy/UIDummyCalendar"));
const UIDummyBlog = React.lazy(() => import("./dummy/UIDummyBlog"));
const UIDummyAlbum = React.lazy(() => import("./dummy/UIDummyAlbum"));
const UIDummyNavigate = React.lazy(() => import("./dummy/UIDummyNavigate"));

export function UIRoutes() {

  return (
    <Routes>
      {/* HOME */}
      <Route path="/*" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={
        <React.Suspense fallback={<Loading/>}>
          <UIHomeLayout />
        </React.Suspense>
      } />
      <Route path="/family-tree" element={<UIFamilyTree />} />
      <Route path="/user" element={
        <React.Suspense fallback={<Loading/>}>
          <UIUser />
        </React.Suspense>
      } />

      {/* APP */}
      <Route path="/about" element={<UIAbout />} />
      <Route path="/album" element={<UIAlbum />} />
      <Route path="/album/image-list" element={<UIImageList />} />
      <Route path="/calendar" element={<UICalendar />} />
      <Route path="/upcoming" element={<UIUpcomming />} />
      <Route path="/developer" element={<UIDeveloper />} />
      <Route path="/blogs" element={<UIBlog />} />
      <Route path="/blog-detail" element={<UIBlogDetail />} />
      <Route path="/funds" element={<UIFund />} />
      <Route path="/fund-detail" element={<UIFundDetail />} />
      <Route path="/register-clan" element={<UIRegisterClan />} />
      <Route path="/register" element={<UIRegister />} />
      <Route path="/theme" element={<UITheme />} />
      <Route path="/certificate-group" element={<UICerificateGroup />} />
      <Route path="/certificates" element={<UICertificate />} />
      <Route path="/certificate-info" element={<UICertificateDetail />} />

      {/* DEMO ROUTES */}
      <Route path="/playground" element={
        <React.Suspense fallback={<Loading/>}>
          <UIPlayground />
        </React.Suspense>
      } />
      <Route path="/demo-funds" element={
        <React.Suspense fallback={<Loading/>}>
          <UIDummyFund />
        </React.Suspense>
      } />
      <Route path="/demo-fund-detail" element={
        <React.Suspense fallback={<Loading/>}>
          <UIDummyFundDetail />
        </React.Suspense>
      } />
      <Route path="/demo-tree" element={
        <React.Suspense fallback={<Loading/>}>
          <UIDummyTree />
        </React.Suspense>
      } />
      <Route path="/demo-calendar" element={
        <React.Suspense fallback={<Loading/>}>
          <UIDummyCalendar />
        </React.Suspense>
      } />
      <Route path="/demo-blogs" element={
        <React.Suspense fallback={<Loading/>}>
          <UIDummyBlog />
        </React.Suspense>
      } />
      <Route path="/demo-album" element={
        <React.Suspense fallback={<Loading/>}>
          <UIDummyAlbum />
        </React.Suspense>
      } />
      <Route path="/dummy-detail" element={
        <React.Suspense fallback={<Loading/>}>
          <UIDummyNavigate />
        </React.Suspense>
      } />
    </Routes>
  );
}
