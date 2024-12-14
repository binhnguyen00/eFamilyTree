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
});

export function AutoLoginProvider({ children }: { children: React.ReactNode }) {
  const { phoneNumber, userInfo, logedIn } = useAutoLogin();

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
      logedIn: logedIn
    }}>
      {children}
    </AutoLoginContext.Provider>
  )
}