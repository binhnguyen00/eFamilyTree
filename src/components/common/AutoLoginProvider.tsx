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
  let [ logedIn, setLogedIn ] = React.useState(false);
  let [ phoneNumber, setPhoneNumber ] = React.useState("");
  let [ user, setUser ] = React.useState({
    id: "",
    name: "",
    avatar: "",
  });

  useAutoLogin({
    update: (phone: string, user: any) => {
      setPhoneNumber(phone);
      setUser(user);
      if (phone.length > 0) {
        setLogedIn(true);
      }
    },
  });

  return (
    <AutoLoginContext.Provider value={{
      phone: phoneNumber,
      user: user,
      logedIn: logedIn
    }}>
      {children}
    </AutoLoginContext.Provider>
  )
}