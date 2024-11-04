import React from "react";
import { Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { UIHomePage } from "./home/UIHome";
import { UIFamilyTree } from "./family-tree/UIFamilyTree";
import { UIAbout } from "./about/UIAbout";
import { UIDummyAlbum } from "./dummy/UIDummyAlbum";
import { UIDummyUpcoming } from "./dummy/UIDummyUpcoming";
import { UIPlayground } from "./dummy/UIPlayground";
import { UIUserHome } from "./user/UIUser";
import { ZmpSDK } from "../utils/ZmpSdk";
import { UIDummyTree } from "./dummy/UIDummyTree";
import { UIBlog } from "./blog/UIBlog";
import { UIBlogDetail } from "./blog/UIBlogDetail";
import { UICalendar } from "./calendar/UICalendar";
import { UIDummyCalendar } from "./dummy/UIDummyCalendar";

import "../i18n";
import { UIDummyBlog } from "./dummy/UIDummyBlog";

export const PhoneNumberContext = React.createContext(null);

const UIProvider = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = React.useState(null);

  React.useEffect(() => {
    // Get User's phone numb on init app. Get once, Zalo has cache.
    ZmpSDK.getPhoneNumber().then((result) => {
      console.log("Phone Number:", result);
      setPhoneNumber(result);
    });
  }, []);

  return (
    <PhoneNumberContext.Provider value={phoneNumber}>
      {children}
    </PhoneNumberContext.Provider>
  );
};

export function Application() {
  return (
    <RecoilRoot>
      <App theme="light">
        <UIProvider>
          <SnackbarProvider>
            <ZMPRouter>
              <AnimationRoutes>
                <Route path="/" element={<UIHomePage/>}/>
                <Route path="/family-tree" element={<UIFamilyTree/>}/>
                <Route path="/about" element={<UIAbout/>}/>
                <Route path="/user" element={<UIUserHome/>}/>
                <Route path="/album" element={<UIDummyAlbum/>}/>
                <Route path="/calendar" element={<UICalendar/>}/>
                <Route path="/upcoming" element={<UIDummyUpcoming/>}/>
                <Route path="/playground" element={<UIPlayground/>}/>
                <Route path="/blogs" element={<UIBlog/>}/>
                <Route path="/blog-detail" element={<UIBlogDetail/>}/>
                <Route path="/demo-tree" element={<UIDummyTree/>}/>
                <Route path="/demo-calendar" element={<UIDummyCalendar/>}/>
                <Route path="/demo-blogs" element={<UIDummyBlog/>}/>
              </AnimationRoutes>
            </ZMPRouter>
          </SnackbarProvider>
        </UIProvider>
      </App>
    </RecoilRoot>
  );
};