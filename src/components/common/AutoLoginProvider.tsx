import React from "react";
import { useAutoLogin } from "hooks";

export const AutoLoginContext = React.createContext({
  phone: "",
  user: null,
});

export function AutoLoginProvider({ children }: { children: React.ReactNode }) {
  console.log("AutoLoginProvider");

  let [ phoneNumber, setPhoneNumber ] = React.useState("");
  let [ user, setUser ] = React.useState(null);

  const updateContext = (phone: string, user: any) => {
    setPhoneNumber(phone);
    setUser(user);
    console.log(phone, user);
  }

  useAutoLogin({
    update: updateContext,
    dependencies: [ phoneNumber, user ]
  });

  return (
    <AutoLoginContext.Provider value={{
      phone: phoneNumber,
      user: user
    }}>
      {children}
    </AutoLoginContext.Provider>
  )
}