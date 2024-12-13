import React from "react";
import { Route, Routes } from "react-router-dom";

import { Loading } from "components";

import { UIFamilyTree } from "pages/family-tree/UIFamilyTree";
import { UIUser } from "pages/user/UIUser";
import { UIHome } from "pages/home/UIHome";
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
import { UICerificateGroup } from "./certificate/UICertificateGroup";
import { UICertificate } from "./certificate/UICertificate";
import { UICertificateDetail } from "./certificate/UICertificateDetail";
import { homePath } from '../states';
import { useRecoilValue } from "recoil";

// Demo components (React.lazy loaded)
const UIDummyFund = React.lazy(() => import("./dummy/UIDummyFund"));
const UIDummyFundDetail = React.lazy(() => import("./dummy/UIDummyFundDetail"));
const UIDummyTree = React.lazy(() => import("./dummy/UIDummyTree"));
const UIDummyCalendar = React.lazy(() => import("./dummy/UIDummyCalendar"));
const UIDummyBlog = React.lazy(() => import("./dummy/UIDummyBlog"));
const UIDummyAlbum = React.lazy(() => import("./dummy/UIDummyAlbum"));
const UIDummyNavigate = React.lazy(() => import("./dummy/UIDummyNavigate"));

export function UIRoutes() {
  const home = useRecoilValue(homePath);

  return (
    <Routes>
      {/* HOME */}
      <Route path={home} element={<UIHome />} />

      <Route path="/family-tree" element={<UIFamilyTree />} />

      <Route path="/user" element={
        <React.Suspense fallback={<Loading />}>
          <UIUser />
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
