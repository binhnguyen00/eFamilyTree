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
  login: () => {}
});

export function AutoLoginProvider({ children }: { children: React.ReactNode }) {
  const { phoneNumber, userInfo, logedIn, login } = useAutoLogin();

  console.log(
    "Auto Login Context:\n", {
      "Phone Number": phoneNumber,
      "User Info": userInfo, 
      "Loged In": logedIn 
    }
  ); 
  
  return (
    <AutoLoginContext.Provider value={{
      phone: phoneNumber,
      user: userInfo,
      logedIn: logedIn,
      login: login
    }}>
      {children}
    </AutoLoginContext.Provider>
  )
}