import React from "react";
import { Route, Routes } from "react-router-dom";

import { Loading } from "components";

import { UIAbout } from "pages/about/UIAbout";
import { UIAlbum } from "pages/album/UIAlbum";
import { UIImageList } from "pages/album/UIImageList";
import { UIBlog } from "pages/blog/UIBlog";
import { UIBlogDetail } from "pages/blog/UIBlogDetail";
import { UICalendar } from "pages/calendar/UICalendar";
import { UICertificate } from "pages/certificate/UICertificate";
import { UICertificateDetail } from "pages/certificate/UICertificateDetail";
import { UICerificateGroup } from "pages/certificate/UICertificateGroup";
import { UIDeveloper } from "pages/dummy/UIDeveloper";
import { UIPlayground } from "pages/dummy/UIPlayground";
import { UIFamilyTree } from "pages/family-tree/UIFamilyTree";
import { UIFund } from "pages/fund/UIFund";
import { UIFundDetail } from "pages/fund/UIFundDetail";
import { UIHome } from "pages/home/UIHome";
import { UITheme } from "pages/theme/UITheme";
import { UIAccount } from "pages/user/UIAccount";
import { UIRegister } from "pages/user/UIRegister";
import { UIRegisterClan } from "pages/user/UIRegisterClan";

import { useAppContext } from "hooks";

// Demo components (React.lazy loaded)
const UIDummyFund = React.lazy(() => import("./dummy/UIDummyFund"));
const UIDummyFundDetail = React.lazy(() => import("./dummy/UIDummyFundDetail"));
const UIDummyTree = React.lazy(() => import("./dummy/UIDummyTree"));
const UIDummyCalendar = React.lazy(() => import("./dummy/UIDummyCalendar"));
const UIDummyBlog = React.lazy(() => import("./dummy/UIDummyBlog"));
const UIDummyAlbum = React.lazy(() => import("./dummy/UIDummyAlbum"));
const UIDummyNavigate = React.lazy(() => import("./dummy/UIDummyNavigate"));

export function AppRoutes() {
  const { appId } = useAppContext();

  return (
    <Routes>
      {/* HOME */}
      <Route path={`/zapps/${appId}`} element={<UIHome />} />

      <Route path="/family-tree" element={<UIFamilyTree />} />

      <Route path="/account" element={
        <React.Suspense fallback={<Loading />}>
          <UIAccount />
        </React.Suspense>
      } />

      {/* APP */}
      <Route path="/about" element={<UIAbout />} />

      <Route path="/album" element={<UIAlbum />}/>
      <Route path="/album/images" element={<UIImageList />} />

      <Route path="/calendar" element={<UICalendar />} />

      <Route path="/blogs" element={<UIBlog />}/>
      <Route path="/blogs/detail" element={<UIBlogDetail />} />

      <Route path="/funds" element={<UIFund />}/>
      <Route path="/funds/detail" element={<UIFundDetail />} />

      <Route path="/register" element={<UIRegister />} />
      <Route path="/register-clan" element={<UIRegisterClan />} />

      <Route path="/theme" element={<UITheme />} />

      <Route path="/certificate" element={<UICerificateGroup />}/>
      <Route path="/certificate/list" element={<UICertificate />}/>
      <Route path="/certificate/list/info" element={<UICertificateDetail />} />

      {/* DEMO ROUTES */}
      <Route path="/dev" element={<UIDeveloper />}/>
      <Route path="/dev/playground" element={
        <React.Suspense fallback={<Loading />}>
          <UIPlayground />
        </React.Suspense>
      } />
      <Route path="/dev/funds" element={
        <React.Suspense fallback={<Loading />}>
          <UIDummyFund />
        </React.Suspense>
      }/>
      <Route path="/dev/funds/detail" element={
        <React.Suspense fallback={<Loading />}>
          <UIDummyFundDetail />
        </React.Suspense>
      } />
      <Route path="/dev/tree" element={
        <React.Suspense fallback={<Loading />}>
          <UIDummyTree />
        </React.Suspense>
      } />
      <Route path="/dev/calendar" element={
        <React.Suspense fallback={<Loading />}>
          <UIDummyCalendar />
        </React.Suspense>
      } />
      <Route path="/dev/blogs" element={
        <React.Suspense fallback={<Loading />}>
          <UIDummyBlog />
        </React.Suspense>
      } />
      <Route path="/dev/album" element={
        <React.Suspense fallback={<Loading />}>
          <UIDummyAlbum />
        </React.Suspense>
      } />
      <Route path="/dev/dummy-detail" element={
        <React.Suspense fallback={<Loading />}>
          <UIDummyNavigate />
        </React.Suspense>
      } />
    </Routes>
  );
}
