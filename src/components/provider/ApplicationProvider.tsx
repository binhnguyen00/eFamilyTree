import React from "react";

import { getAppConfig } from "utils";
import { BaseApi, UserSettingApi } from "api";
import { useAutoLogin, useClanMemberInfo, useSettings } from "hooks";

import { UserSettings } from "types/user-settings";
import { AppContext as AppCtx } from "types/app-context";
import { FailResponse, ServerResponse } from "types/server";

export const AppContext = React.createContext({} as AppCtx);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const ZALO_APP_ID = getAppConfig((config) => config.app.id);

  // use hooks
  const { 
    logedIn,
    phoneNumber, 
    zaloUserInfo, 
    updateZaloUserInfo,
    updatePhoneNumber,  
    refresh
  }                                  = useAutoLogin();
  const { userInfo, modules }        = useClanMemberInfo(phoneNumber);
  const { 
    settings, 
    updateSettings, 
    updateTheme, 
    updateLanguage, 
  }                                  = useSettings(userInfo.id, userInfo.clanId);
  
  const ctxInfo = React.useMemo(() => {
    let ctxInfo = {
      appId:              ZALO_APP_ID,
      logedIn:            logedIn,
      phoneNumber:        phoneNumber,
      zaloUserInfo:       zaloUserInfo,
      userInfo:           userInfo,
      modules:            modules,
      settings:           settings,
      serverBaseUrl:      BaseApi.getServerBaseUrl(),
      treeBackgroundPath: getTreeBackgroundPath(settings, BaseApi.getServerBaseUrl()),
    } as any;
    console.log("App Context:\n", ctxInfo); 
    return ctxInfo;
  }, [ logedIn, phoneNumber, zaloUserInfo, userInfo, modules, settings ]);

  React.useEffect(() => {
    if (userInfo.id && userInfo.clanId) {
      UserSettingApi.increaseIntroductionPeriod({
        userId: userInfo.id,
        clanId: userInfo.clanId,
        success: (result: ServerResponse) => {},
        fail: (error: FailResponse) => {
          console.error("Increase introduction period fail:\n", error.message);
        }
      })
    }
  }, [ userInfo.id, userInfo.clanId ])

  const appCtx: AppCtx = {
    ...ctxInfo,
    updatePhoneNumber:  updatePhoneNumber,
    updateZaloUserInfo: updateZaloUserInfo,
    updateSettings:     updateSettings,
    updateTheme:        updateTheme,
    updateLanguage:     updateLanguage,
    doLogin:            refresh,
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