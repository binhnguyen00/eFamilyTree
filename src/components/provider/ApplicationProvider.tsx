import React from "react";

import { BaseApi } from "api";
import { CommonUtils, getAppConfig } from "utils";
import { useAutoLogin, useSettings } from "hooks";

import { ServerResponse } from "types/server";
import { UserSettings } from "types/user-settings";
import { AppContext as AppCtx, UserInfo } from "types/app-context";

// =======================================
// APP CTX
// =======================================
export const AppContext = React.createContext({} as AppCtx);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const ZALO_APP_ID = getAppConfig((config) => {
    return config.app.id;
  });

  // use hooks
  const { 
    logedIn,
    phoneNumber, 
    zaloUserInfo, 
    updateZaloUserInfo,
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
  } as any;
  console.log("App Context:\n", ctxInfo); 

  const appCtx: AppCtx = {
    ...ctxInfo,
    updatePhoneNumber: updatePhoneNumber,
    updateZaloUserInfo: updateZaloUserInfo,
    updateSettings: updateSettings,
  };

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
function useUserAppContext(phoneNumber: string) {
  let [ info, setInfo ] = React.useState<UserInfo>({
    id: 0,
    name: "unknown",
    clanId: 0,
    generation: 0,
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
          } as UserInfo);
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