import React from "react";

import { BaseApi } from "api";
import { CommonUtils } from "utils";
import { UserSettings } from "types/user-settings";
import { ServerResponse } from "server";

import { useAutoLogin, useSettings } from "hooks";

// =======================================
// APP CTX
// =======================================
export interface AppCtx {
  appId: string;
  logedIn: boolean;
  phoneNumber: string;
  serverBaseUrl: string;
  userInfo: ClanMemberInfo,
  modules: string[],
  zaloUserInfo: {
    id: string;
    name: string;
    avatar: string;
  };
  settings: UserSettings;
  treeBackgroundPath: string,
  updatePhoneNumber: (phoneNumber: string) => void,
  updateUserInfo: (userInfo: any) => void,
  updateSettings: (settings: any) => void
}

export const AppContext = React.createContext({} as AppCtx);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const ZALO_APP_ID = import.meta.env.VITE_APP_ZALO_APP_ID;

  // use hooks
  const { 
    logedIn,
    phoneNumber, 
    zaloUserInfo, 
    updateUserInfo,
    updatePhoneNumber, 
  }                                   = useAutoLogin();
  const { userInfo, modules }         = useUserAppContext(phoneNumber);
  const { settings, updateSettings }  = useSettings(userInfo.id, userInfo.clanId);
  
  const ctxInfo = {
    appId: ZALO_APP_ID,
    logedIn: logedIn,
    phoneNumber: phoneNumber,
    zaloUserInfo: zaloUserInfo,
    userInfo: userInfo,
    modules: modules,
    settings: settings,
    serverBaseUrl: BaseApi.getServerBaseUrl(),
    treeBackgroundPath: getTreeBackgroundPath(settings, BaseApi.getServerBaseUrl()),
  };
  console.log("App Context:\n", ctxInfo); 

  const appCtx = {
    ...ctxInfo,
    updatePhoneNumber: updatePhoneNumber,
    updateUserInfo: updateUserInfo,
    updateSettings: updateSettings,
  } as AppCtx;

  return (
    <AppContext.Provider value={appCtx}>
      {children}
    </AppContext.Provider>
  )
}

function getTreeBackgroundPath(settings: UserSettings, serverBaseUrl: string) {
  if (settings.background && settings.background.id !== 0) {
    return `${serverBaseUrl}/${settings.background.path}`;
  } else {
    return "";
  }
}

// =======================================
// USER INFO CTX
// =======================================
interface ClanMemberInfo {
  id: number;
  name: string;
  clanId: number;
  generation: number
}
function useUserAppContext(phoneNumber: string) {
  let [ info, setInfo ] = React.useState<ClanMemberInfo>({
    id: 0,
    name: "unknown",
    clanId: 0,
    generation: 0
  })
  let [ modules, setModules ] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (phoneNumber && !CommonUtils.isStringEmpty(phoneNumber)) {
      const success = (result: ServerResponse) => {
        if (result.status === "success") {
          const data = result.data;
          const info = data.info;
          setInfo({
            id: info["id"],
            name: info["name"],
            clanId: info["clan_id"],
            generation: info["generation"]
          } as ClanMemberInfo);
          setModules(data.modules);
        } else {
          console.warn(result.message);
        }
      }
      BaseApi.getUserAppContext(phoneNumber, success);
    }
  }, [phoneNumber])

  return {
    userInfo: info,
    modules: modules
  };
}