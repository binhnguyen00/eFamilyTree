import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import { AnimationRoutes } from "zmp-ui";
import { t } from "i18next";

import { Loading, SwipeGesture } from "components";

import { UIFamilyTree } from "pages/family-tree/UIFamilyTree";
import { Navigation } from "components/common/Navigation";
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
import { UIFamilyMember } from "./family-tree/UIFamilyMember";
import { UICerificateGroup } from "./certificate/UICertificateGroup";
import { UICertificate } from "./certificate/UICertificate";
import { UICertificateDetail } from "./certificate/UICertificateDetail";

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
    <AnimationRoutes>
      <Route path="/" element={<UIHomeLayout />} />
      <Route path="/family-tree" element={<UIFamilyTree />} />
      <Route path="/user" element={<UIUser/>} />
    </AnimationRoutes>
  );
}

// animated routes
function SubRoutes() {
  return (
    <AnimationRoutes>

      <Route path="/family-member-info" element={<UIFamilyMember />} />
      <Route path="/about" element={<UIAbout />} />
      <Route path="/album" element={<UIAlbum />} />
      <Route path="/album/image-list" element={<UIImageList />} />
      <Route path="/calendar" element={<UICalendar />} />
      <Route path="/upcoming" element={<UIUpcomming />} />
      <Route path="/developer" element={<UIDeveloper />} />
      <Route path="/blogs" element={<UIBlog />} />
      <Route path="/blog-detail" element={<UIBlogDetail />} />
      <Route path="/funds" element={<UIFund />} />
      <Route path="/register-clan" element={<UIRegisterClan />} />
      <Route path="/register" element={<UIRegister />} />
      <Route path="/theme" element={<UITheme />} />
      <Route path="/certificate-group" element={<UICerificateGroup />} />
      <Route path="/certificates" element={<UICertificate />} />
      <Route path="/certificate-info" element={<UICertificateDetail />} />

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
    <SwipeGesture>
      <Suspense>
        <MainRoutes />
      </Suspense>

      <Suspense>
        <SubRoutes />
      </Suspense>

      <Navigation/>
    </SwipeGesture>
  );
}
