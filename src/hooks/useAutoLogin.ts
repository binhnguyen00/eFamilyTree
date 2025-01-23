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
  });

  const hasPermission = useGetPhonePermission();

  const updatePhoneNumber = (phoneNumber: string) => {
    setPhoneNumber(phoneNumber);
  }

  const updateZaloUserInfo = (zaloUserInfo: ZaloUserInfo) => {
    setUser(zaloUserInfo);
  }

  React.useEffect(() => {
    if (hasPermission) {
      ZmpSDK.getUserInfo(
        (zaloUserInfo: any) => setUser(zaloUserInfo),
        (error: any) => console.error("useAutoLogin User Info Error:\n\t", error)
      );
      ZmpSDK.getPhoneNumber(
        (number: string) => setPhoneNumber(number),
        (error: any) => console.error("useAutoLogin Phone Error:\n\t", error)
      );
    }
  }, [hasPermission]);

  const authSettings = useZaloSettings();

  return {
    zaloUserInfo: {
      ...user,
      ...authSettings
    },
    phoneNumber: phone,
    logedIn: phone.length > 0,
    updatePhoneNumber: updatePhoneNumber,
    updateZaloUserInfo: updateZaloUserInfo
  };
}