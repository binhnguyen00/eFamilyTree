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
}

export const AppContext = React.createContext({
  logedIn: false,
  phoneNumber: "",
  userInfo: {
    id: "",
    name: "",
    avatar: "",
  },
  settings: {
    theme: "",
    language: ""
  },
  updatePhoneNumber: (phoneNumber: string) => {},
  updateUserInfo: (userInfo: any) => {},
  updateSettings: (settings: any) => {}
});

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const { phoneNumber, userInfo, logedIn, updatePhoneNumber, updateUserInfo } = useAutoLogin();
  const { settings, updateSettings } = useSetting(phoneNumber);
  const { toggleTheme } = useTheme();

  toggleTheme(settings.theme);
  
  const appCtx = {
    logedIn: logedIn,
    phoneNumber: phoneNumber,
    userInfo: userInfo,
    userSetting: settings
  }
  console.log("App Context:\n", appCtx); 

  return (
    <AppContext.Provider value={{
      logedIn: logedIn,
      phoneNumber: phoneNumber,
      userInfo: userInfo,
      settings: settings,
      updatePhoneNumber: updatePhoneNumber,
      updateUserInfo: updateUserInfo,
      updateSettings: updateSettings
    }}>
      {children}
    </AppContext.Provider>
  )
}