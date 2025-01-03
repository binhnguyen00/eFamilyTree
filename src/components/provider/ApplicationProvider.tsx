import React from "react";

import { Settings } from "hooks/useSettings";
import { useAutoLogin, useSettings } from "hooks";

export interface AppCtx {
  appId: string;
  logedIn: boolean;
  phoneNumber: string;
  serverBaseUrl: string;
  userInfo: {
    id: string;
    name: string;
    avatar: string;
  };
  settings: Settings;
  updatePhoneNumber: (phoneNumber: string) => void,
  updateUserInfo: (userInfo: any) => void,
  updateSettings: (settings: any) => void
}

export const AppContext = React.createContext({} as AppCtx);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const appId = import.meta.env.VITE_APP_ZALO_APP_ID;

  const { phoneNumber, userInfo, logedIn, updatePhoneNumber, updateUserInfo } = useAutoLogin();
  const { settings, updateSettings } = useSettings(phoneNumber);
  
  const ctxInfo = {
    appId: appId,
    logedIn: logedIn,
    phoneNumber: phoneNumber ? phoneNumber : "0942659016",
    userInfo: userInfo,
    settings: settings,
    serverBaseUrl: "https://giapha.mobifone5.vn"
  }
  console.log("App Context:\n", ctxInfo); 

  const appCtx = {
    ...ctxInfo,
    updatePhoneNumber: updatePhoneNumber,
    updateUserInfo: updateUserInfo,
    updateSettings: updateSettings
  } as AppCtx;

  return (
    <AppContext.Provider value={appCtx}>
      {children}
    </AppContext.Provider>
  )
}