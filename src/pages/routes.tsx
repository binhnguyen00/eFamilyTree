import React from "react";
import { Route, Routes } from "react-router-dom";

import { Loading } from "components";

import { UIAbout } from "pages/about/UIAbout";
import { UIAlbumList } from "pages/gallery/UIAlbumList";
import { UIImageList } from "pages/gallery/UIImageList";
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
import { UIGallery } from 'pages/gallery/UIGallery';

import { useRouteNavigate } from "hooks";

// Demo components (React.lazy loaded)
const UIDummyFund = React.lazy(() => import("./dummy/UIDummyFund"));
const UIDummyFundDetail = React.lazy(() => import("./dummy/UIDummyFundDetail"));
const UIDummyTree = React.lazy(() => import("./dummy/UIDummyTree"));
const UIDummyCalendar = React.lazy(() => import("./dummy/UIDummyCalendar"));
const UIDummyBlog = React.lazy(() => import("./dummy/UIDummyBlog"));
const UIDummyNavigate = React.lazy(() => import("./dummy/UIDummyNavigate"));

export function AppRoutes() {
  const { createPath, rootPath } = useRouteNavigate();

  return (
    <Routes>
      {/* HOME */}
      <Route path={rootPath} element={<UIHome />}/> 
      <Route path={createPath("family-tree")} element={<UIFamilyTree />} />
      <Route path={createPath("account")} element={
        <React.Suspense fallback={<Loading />}>
          <UIAccount />
        </React.Suspense>
      } />

      {/* APP */}
      <Route path={createPath("about")} element={<UIAbout />} />

      <Route path={createPath("gallery")} element={<UIGallery />}/>

      <Route path={createPath("album")} element={<UIAlbumList />}/>
      <Route path={createPath("album/images")} element={<UIImageList />} />

      <Route path={createPath("calendar")} element={<UICalendar />} />

      <Route path={createPath("blogs")} element={<UIBlog />}/>
      <Route path={createPath("blogs/detail")} element={<UIBlogDetail />} />

      <Route path={createPath("funds")} element={<UIFund />}/>
      <Route path={createPath("funds/detail")} element={<UIFundDetail />} />

      <Route path={createPath("register")} element={<UIRegister />} />
      <Route path={createPath("register/clan")} element={<UIRegisterClan />} />

      <Route path={createPath("theme")} element={<UITheme />} />

      <Route path={createPath("certificate")} element={<UICerificateGroup />}/>
      <Route path={createPath("certificate/list")} element={<UICertificate />}/>
      <Route path={createPath("certificate/list/info")} element={<UICertificateDetail />} />

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
      <Route path="/dev/gallery" element={
        <React.Suspense fallback={<Loading />}>
          <UIGallery />
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
