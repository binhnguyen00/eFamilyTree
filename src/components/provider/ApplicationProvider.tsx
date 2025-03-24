import React from "react";

import { BaseApi } from "api";
import { getAppConfig } from "utils";
import { useAutoLogin, useClanMemberInfo, useSettings } from "hooks";

import { UserSettings } from "types/user-settings";
import { AppContext as AppCtx } from "types/app-context";

export const AppContext = React.createContext({} as AppCtx);

export function useAppContext() {
  return React.useContext(AppContext);
}

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
    refresh
  }                                   = useAutoLogin();
  const { userInfo, modules }         = useClanMemberInfo(phoneNumber);
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
    doLogin: refresh,
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