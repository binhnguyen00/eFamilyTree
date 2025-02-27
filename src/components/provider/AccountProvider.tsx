import React from "react";

import { UserInfo } from "types/app-context";
import { ServerResponse } from "types/server";

export type AccountContext = {
  userInfo: UserInfo;
}

export const AccountContext = React.createContext({} as AccountContext);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  
  const context = {

  } as AccountContext;

  return (
    <AccountContext.Provider value={context}>
      {children}
    </AccountContext.Provider>
  )
}