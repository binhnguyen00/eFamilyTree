import React, { lazy, Suspense } from "react";
import { Box } from "zmp-ui";
import { Route, Routes } from "react-router-dom";
import { t } from "i18next";
import { CommonComponentUtils } from "components/common/CommonComponentUtils";
import UINavigation from "components/common/UINavigation";

// Lazy load components
const UIHomePage = lazy(() => import("pages/home/UIHome"));
const UIUserDetail = lazy(() => import("pages/user/UIUserDetail"));
const UIFamilyTree = lazy(() => import("pages/family-tree/UIFamilyTree"));
const UIAbout = lazy(() => import("pages/about/UIAbout"));
const UIBlog = lazy(() => import("./blog/UIBlog"));
const UIBlogDetail = lazy(() => import("./blog/UIBlogDetail"));
const UIFund = lazy(() => import("./fund/UIFund"));
const UIFundDetail = lazy(() => import("./fund/UIFund"));
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

// Helper function for rendering fallback loading UI
const renderLoading = (message) => (
  <div style={{ height: "100vh" }}>
    {CommonComponentUtils.renderLoading(message)}
  </div>
);

// Component for Main Routes
function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UIHomePage />} />
      <Route path="/family-tree" element={
        <Suspense fallback={renderLoading(t("loading_family_tree"))}>
          <UIFamilyTree />
        </Suspense>
      } />
      <Route path="/family-member-info" element={
        <Suspense fallback={renderLoading(t("loading"))}>
          <UIFamilyMember />
        </Suspense>
      } />
      <Route path="/about" element={<UIAbout />} />
      <Route path="/user" element={<UIUserDetail />} />
      <Route path="/album" element={
        <Suspense fallback={renderLoading(t("loading_album"))}>
          <UIAlbum />
        </Suspense>
      } />
      <Route path="/calendar" element={
        <Suspense fallback={renderLoading(t("loading_calendar"))}>
          <UICalendar />
        </Suspense>
      } />
      <Route path="/upcoming" element={<UIDummyUpcoming />} />
      <Route path="/developer" element={<UIDeveloper />} />
      <Route path="/blogs" element={
        <Suspense fallback={renderLoading(t("loading_blogs"))}>
          <UIBlog />
        </Suspense>
      } />
      <Route path="/blog-detail" element={<UIBlogDetail />} />
      <Route path="/funds" element={
        <Suspense fallback={renderLoading(t("loading_funds"))}>
          <UIFund />
        </Suspense>
      } />
      <Route path="/fund-detail" element={<UIFundDetail />} />
      <Route path="/playground" element={<UIPlayground />} />
    </Routes>
  );
}

// Component for Demo Routes
function DemoRoutes() {
  return (
    <Routes>
      <Route path="/demo-funds" element={<UIDummyFund />} />
      <Route path="/demo-fund-detail" element={<UIDummyFundDetail />} />
      <Route path="/demo-tree" element={<UIDummyTree />} />
      <Route path="/demo-calendar" element={<UIDummyCalendar />} />
      <Route path="/demo-blogs" element={<UIDummyBlog />} />
      <Route path="/demo-album" element={<UIDummyAlbum />} />
      <Route path="/dummy-detail" element={<UIDummyNavigate />} />
    </Routes>
  );
}

function UILayout() {
  return (
    <Box flex flexDirection="column">
      <Box flex flexDirection="column">
        {/* Render Main Routes */}
        <Suspense>
          <MainRoutes />
        </Suspense>

        {/* Render Demo Routes */}
        <Suspense fallback={renderLoading(t("loading"))}>
          <DemoRoutes />
        </Suspense>
      </Box>
      
      <UINavigation />
    </Box>
  );
}

export default UILayout;
