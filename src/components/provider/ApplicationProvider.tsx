import React from "react";
import { useAutoLogin, useSetting, useTheme } from "hooks";

interface AppCtx {
  logedIn: boolean;
  phoneNumber: string;
  userInfo: {
    id: string;
    name: string;
    avatar: string;
  };
  settings: {
    theme: string;
    language: string;
  };
  appId: string;
  updatePhoneNumber: (phoneNumber: string) => void,
  updateUserInfo: (userInfo: any) => void,
  updateSettings: (settings: any) => void
}

export const AppContext = React.createContext({} as AppCtx);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const appId = import.meta.env.VITE_APP_ZALO_APP_ID;

  const { phoneNumber, userInfo, logedIn, updatePhoneNumber, updateUserInfo } = useAutoLogin();
  const { settings, updateSettings } = useSetting(phoneNumber);
  const { toggleTheme } = useTheme();

  toggleTheme(settings.theme);
  
  const appCtx = {
    logedIn: logedIn,
    phoneNumber: phoneNumber,
    userInfo: userInfo,
    settings: settings,
    appId: appId,
    updatePhoneNumber: updatePhoneNumber,
    updateUserInfo: updateUserInfo,
    updateSettings: updateSettings
  } as AppCtx;
  console.log("App Context:\n", appCtx); 

  return (
    <AppContext.Provider value={appCtx}>
      {children}
    </AppContext.Provider>
  )
}