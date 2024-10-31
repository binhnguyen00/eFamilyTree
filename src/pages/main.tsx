import React from "react";
import { Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { UIHomePage } from "./home/UIHome";
import { UIFamilyTree } from "./family-tree/UIFamilyTree";
import { UIAbout } from "./about/UIAbout";
import { UIDummyAlbum } from "./dummy/UIDummyAlbum";
import { UIDummyCalendar } from "./dummy/UIDummyCalendar";
import { UIDummyUpcoming } from "./dummy/UIDummyUpcoming";
import { UIPlayground } from "./dummy/UIPlayground";
import { UIUserHome } from "./user/UIUser";
import { ZmpSDK } from "../utils/ZmpSdk";
import { UIDummyTree } from "./dummy/UIDummyTree";
import { UIBlog } from "./blog/UIBlog";

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
                <Route path="/calendar" element={<UIDummyCalendar/>}/>
                <Route path="/upcoming" element={<UIDummyUpcoming/>}/>
                <Route path="/playground" element={<UIPlayground/>}/>
                <Route path="/demo-tree" element={<UIDummyTree/>}/>
                <Route path="/blog" element={<UIBlog/>}/>
              </AnimationRoutes>
            </ZMPRouter>
          </SnackbarProvider>
        </UIProvider>
      </App>
    </RecoilRoot>
  );
};