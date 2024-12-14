import React from "react";
import { useAutoLogin } from "hooks";

export const AutoLoginContext = React.createContext({
  phone: "",
  user: null,
});

export function AutoLoginProvider({ children }: { children: React.ReactNode }) {
  let [ phoneNumber, setPhoneNumber ] = React.useState("");
  let [ user, setUser ] = React.useState(null);

  useAutoLogin({
    update: (phone: string, user: any) => {
      setPhoneNumber(phone);
      setUser(user);
    },
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