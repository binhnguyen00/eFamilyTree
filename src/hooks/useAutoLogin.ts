import React from "react";

import { ZmpSDK } from "utils";
import { useGetPhonePermission, useZaloSettings } from "hooks";

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

  const hasPermission = useGetPhonePermission();

  const updatePhoneNumber = (phoneNumber: string) => {
    setPhoneNumber(phoneNumber);
  }

  const updateZaloUserInfo = (zaloUserInfo: ZaloUserInfo) => {
    setUser(zaloUserInfo);
  }

  const refresh = () => { setReload(!reload) }

  const settings = useZaloSettings();

  React.useEffect(() => {
    if (hasPermission) {
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
  }, [ hasPermission, reload ]);

  return {
    zaloUserInfo: user,
    phoneNumber: phone,
    logedIn: phone.length > 0,
    updatePhoneNumber: updatePhoneNumber,
    updateZaloUserInfo: updateZaloUserInfo,
    refresh: refresh
  };
}