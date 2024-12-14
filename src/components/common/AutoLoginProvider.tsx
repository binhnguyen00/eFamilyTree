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
      const ctxMessage: string = `
      1. phone: ${phone}
      2. user: ${JSON.stringify(user, null, 2)}
      `;
      console.log("Auto Login Ctx:", ctxMessage);
      if (user) setUser(user);
      if (phone.length > 0) {
        setPhoneNumber(phone);
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