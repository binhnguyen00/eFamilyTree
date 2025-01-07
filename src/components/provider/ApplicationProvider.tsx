import React from "react";

import { Settings } from "hooks/useSettings";
import { ClanMemberInfo } from "hooks/useClanMemberInfo";
import { useAutoLogin, useClanMemberInfo, useSettings } from "hooks";

export interface AppCtx {
  appId: string;
  logedIn: boolean;
  phoneNumber: string;
  serverBaseUrl: string;
  userInfo: ClanMemberInfo,
  zaloUserInfo: {
    id: string;
    name: string;
    avatar: string;
  };
  settings: Settings;
  getTreeBackgroundPath: () => string,
  updatePhoneNumber: (phoneNumber: string) => void,
  updateUserInfo: (userInfo: any) => void,
  updateSettings: (settings: any) => void
}

export const AppContext = React.createContext({} as AppCtx);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const appId = import.meta.env.VITE_APP_ZALO_APP_ID;

  const { phoneNumber, zaloUserInfo, logedIn, updatePhoneNumber, updateUserInfo } = useAutoLogin();

  const userInfo = useClanMemberInfo(phoneNumber);
  
  const { settings, updateSettings } = useSettings(userInfo.id, userInfo.clanId);
  
  const ctxInfo = {
    appId: appId,
    logedIn: logedIn,
    phoneNumber: phoneNumber ? phoneNumber : "0942659016",
    zaloUserInfo: zaloUserInfo,
    userInfo: userInfo,
    settings: settings,
    serverBaseUrl: "https://giapha.mobifone5.vn"
  }
  console.log("App Context:\n", ctxInfo); 

  const getTreeBackgroundPath = () => {
    if (settings.background && settings.background.id !== 0) {
      return `${ctxInfo.serverBaseUrl}/${settings.background.path}`;
    } else {
      return "";
    }
  }

  const appCtx = {
    ...ctxInfo,
    updatePhoneNumber: updatePhoneNumber,
    updateUserInfo: updateUserInfo,
    updateSettings: updateSettings,
    getTreeBackgroundPath: getTreeBackgroundPath,
  } as AppCtx;

  return (
    <AppContext.Provider value={appCtx}>
      {children}
    </AppContext.Provider>
  )
}