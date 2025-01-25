import React from "react";

import { ZmpSDK } from "utils";
import { useGetPhonePermission, useZaloSettings } from "hooks";

import { ZaloUserInfo } from "types/app-context";
import { AutoLoginContext } from "types/auto-login";

export function useAutoLogin(): AutoLoginContext {
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

  const settings = useZaloSettings();

  React.useEffect(() => {
    if (hasPermission) {
      ZmpSDK.getPhoneNumber(
        (number: string) => setPhoneNumber(number),
        (error: any) => console.error("useAutoLogin Phone Error:\n\t", error)
      );
      ZmpSDK.getUserInfo(
        (zaloUserInfo: any) => setUser({
          id: zaloUserInfo.id,
          name: zaloUserInfo.name,
          avatar: zaloUserInfo.avatar,
          authSettings: settings
        }),
        (error: any) => console.error("useAutoLogin User Info Error:\n\t", error)
      );
    }
  }, [ hasPermission ]);

  return {
    zaloUserInfo: user,
    phoneNumber: phone,
    logedIn: phone.length > 0,
    updatePhoneNumber: updatePhoneNumber,
    updateZaloUserInfo: updateZaloUserInfo
  };
}