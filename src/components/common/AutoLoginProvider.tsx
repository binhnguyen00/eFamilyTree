import React from "react";
import { useAutoLogin } from "hooks";

export const AutoLoginContext = React.createContext({
  phone: "",
  user: {
    id: "",
    name: "",
    avatar: "",
  },
  logedIn: false,
  updateCtx: (phoneNumber: string, userInfo: any) => {}
});

export function AutoLoginProvider({ children }: { children: React.ReactNode }) {
  const { phoneNumber, userInfo, logedIn, updateCtx } = useAutoLogin();

  const autoLoginCtx = {
    phoneNumber: phoneNumber,
    userInfo: userInfo,
    logedIn: logedIn,
    updateCtx: updateCtx
  }
  console.log("Auto Login Context:\n", autoLoginCtx); 
  
  return (
    <AutoLoginContext.Provider value={{
      phone: phoneNumber,
      user: userInfo,
      logedIn: logedIn,
      updateCtx: updateCtx
    }}>
      {children}
    </AutoLoginContext.Provider>
  )
}