import React from "react";
import { useAutoLogin, useSetting } from "hooks";

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
  updateCtx: (phoneNumber: string, userInfo: any) => {}
});

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const { phoneNumber, userInfo, logedIn, updateCtx } = useAutoLogin();
  const { language, theme } = useSetting(phoneNumber);
  
  const userSetting = { 
    theme: theme,
    language: language
  }

  const appCtx = {
    logedIn: logedIn,
    phoneNumber: phoneNumber,
    userInfo: userInfo,
    userSetting: userSetting
  }
  console.log("App Context:\n", appCtx); 

  return (
    <AppContext.Provider value={{
      logedIn: logedIn,
      phoneNumber: phoneNumber,
      userInfo: userInfo,
      settings: userSetting,
      updateCtx: updateCtx
    }}>
      {children}
    </AppContext.Provider>
  )
}