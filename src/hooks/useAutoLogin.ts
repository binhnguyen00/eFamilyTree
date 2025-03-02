import React from "react";

import { ZmpSDK } from "utils";
import { useZaloSettings } from "hooks";

import { ZaloUserInfo } from "types/app-context";
import { AutoLoginContext } from "types/auto-login";

export function useAutoLogin(): AutoLoginContext {
  const [ reload, setReload ]     = React.useState<boolean>(false);
  const [ phone, setPhoneNumber ] = React.useState<string>("");
  const [ user, setUser ]         = React.useState<ZaloUserInfo>({ 
    id: "", 
    name: "", 
    avatar: "",
    authSettings: {
      "scope.camera": false,
      "scope.micro": false,
      "scope.userInfo": false,
      "scope.userLocation": false,
      "scope.userPhonenumber": false,
    }
  });
  const settings = useZaloSettings();

  const updatePhoneNumber = (phoneNumber: string) => setPhoneNumber(phoneNumber);
  const updateZaloUserInfo = (zaloUserInfo: ZaloUserInfo) => setUser(zaloUserInfo);
  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    if (settings["scope.userPhonenumber"]) {
      ZmpSDK.getPhoneNumber(
        (number: string) => setPhoneNumber(number),
        (error: any) => {}
      );
      ZmpSDK.getUserInfo(
        (zaloUserInfo: any) => setUser({
          id: zaloUserInfo.id,
          name: zaloUserInfo.name,
          avatar: zaloUserInfo.avatar,
          authSettings: settings
        }),
        (error: any) => {}
      );
    }
  }, [ settings["scope.userPhonenumber"], reload ]);

  return {
    zaloUserInfo: user,
    phoneNumber: phone,
    logedIn: phone.length > 0,
    updatePhoneNumber: updatePhoneNumber,
    updateZaloUserInfo: updateZaloUserInfo,
    refresh: refresh
  };
}