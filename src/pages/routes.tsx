import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AnimationRoutes, Box } from "zmp-ui";
import { t } from "i18next";

import { Loading } from "components";

import UIUser from "pages/user/UIUser";
import UIFamilyTree from "pages/family-tree/UIFamilyTree";
import UIHomeLayout from "pages/home/UIHomeLayout";
import UIAbout from "pages/about/UIAbout";
import UIImageList from "./album/UIImageList";
import UINavigation from "components/common/Navigation";
import UIRegisterClan from "./user/UIRegisterClan";
import UIRegister from "./user/UIRegister";
import UITheme from "./theme/UITheme";

// Lazy load components
const UIBlog = lazy(() => import("./blog/UIBlog"));
const UIBlogDetail = lazy(() => import("./blog/UIBlogDetail"));
const UIFund = lazy(() => import("./fund/UIFund"));
const UIFundDetail = lazy(() => import("./fund/UIFundDetail"));
const UICalendar = lazy(() => import("./calendar/UICalendar"));
const UIAlbum = lazy(() => import("./album/UIAlbum"));
const UIPlayground = lazy(() => import("./dummy/UIPlayground"));
const UIDeveloper = lazy(() => import("./dummy/UIDeveloper"));
const UIDummyUpcoming = lazy(() => import("./dummy/UIDummyUpcoming"));
const UIFamilyMember = lazy(() => import("./family-tree/UIFamilyMember"));

// Demo components (lazy loaded)
const UIDummyFund = lazy(() => import("./dummy/UIDummyFund"));
const UIDummyFundDetail = lazy(() => import("./dummy/UIDummyFundDetail"));
const UIDummyTree = lazy(() => import("./dummy/UIDummyTree"));
const UIDummyCalendar = lazy(() => import("./dummy/UIDummyCalendar"));
const UIDummyBlog = lazy(() => import("./dummy/UIDummyBlog"));
const UIDummyAlbum = lazy(() => import("./dummy/UIDummyAlbum"));
const UIDummyNavigate = lazy(() => import("./dummy/UIDummyNavigate"));

// Component for Main Routes
function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UIHomeLayout />} />
      <Route path="/family-tree" element={
        <Suspense fallback={<div className="container"> <Loading message={t("loading_family_tree")} /> </div>}>
          <UIFamilyTree />
        </Suspense>
      } />
      <Route path="/user" element={
        <Suspense fallback={<div className="container"> <Loading message={t("loading")} /> </div>}>
          <UIUser/>
        </Suspense>
      } />
    </Routes>
  );
}

// animated routes
function AnimatedRoutes() {
  return (
    <AnimationRoutes>

      <Route path="/family-member-info" element={
        <Suspense fallback={<Loading message={t("loading")} />}>
          <UIFamilyMember />
        </Suspense>
      } />
      <Route path="/about" element={<UIAbout />} />
      <Route path="/album" element={
        <Suspense fallback={<Loading message={t("loading_album")} />}>
          <UIAlbum />
        </Suspense>
      } />
      <Route path="/album/image-list" element={
        <Suspense fallback={<Loading message={t("loading_album")} />}>
          <UIImageList />
        </Suspense>
      } />
      <Route path="/calendar" element={
        <Suspense fallback={<Loading message={t("loading_calendar")} />}>
          <UICalendar />
        </Suspense>
      } />
      <Route path="/upcoming" element={<UIDummyUpcoming />} />
      <Route path="/developer" element={<UIDeveloper />} />
      <Route path="/blogs" element={
        <Suspense fallback={<Loading message={t("loading_blogs")} />}>
          <UIBlog />
        </Suspense>
      } />
      <Route path="/blog-detail" element={<UIBlogDetail />} />
      <Route path="/funds" element={
        <Suspense fallback={<Loading message={t("loading_funds")} />}>
          <UIFund />
        </Suspense>
      } />
      <Route path="/register-clan" element={<UIRegisterClan />} />
      <Route path="/register" element={<UIRegister />} />
      <Route path="/theme" element={<UITheme />} />

      {/* DEMO ROUTES */}
      <Route path="/fund-detail" element={<UIFundDetail />} />
      <Route path="/playground" element={<UIPlayground />} />
      <Route path="/demo-funds" element={<UIDummyFund />} />
      <Route path="/demo-fund-detail" element={<UIDummyFundDetail />} />
      <Route path="/demo-tree" element={<UIDummyTree />} />
      <Route path="/demo-calendar" element={<UIDummyCalendar />} />
      <Route path="/demo-blogs" element={<UIDummyBlog />} />
      <Route path="/demo-album" element={<UIDummyAlbum />} />
      <Route path="/dummy-detail" element={<UIDummyNavigate />} />

    </AnimationRoutes>
  );
}

export default function UIRoutes() {
  return (
    <>
      <Suspense>
        <MainRoutes />
      </Suspense>

      <Suspense>
        <AnimatedRoutes />
      </Suspense>

      <UINavigation/>
    </>
  );
}
