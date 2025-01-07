import React from "react";
import { ZmpSDK } from "utils";
import { useGetPhonePermission } from "hooks";

interface ZaloUserInfo {
  id: string;
  name: string;
  avatar: string;
}

interface AutoLoginCtx {
  zaloUserInfo: ZaloUserInfo;
  phoneNumber: string;
  logedIn: boolean;
  updatePhoneNumber: (phoneNumber: string) => void;
  updateUserInfo: (zaloUserInfo: ZaloUserInfo) => void;
}

export function useAutoLogin(): AutoLoginCtx {
  const [ user, setUser ] = React.useState<ZaloUserInfo>({ id: "", name: "", avatar: "" });
  const [ phone, setPhoneNumber ] = React.useState<string>("");
  const hasPermission = useGetPhonePermission();

  const updatePhoneNumber = (phoneNumber: string) => {
    setPhoneNumber(phoneNumber);
  }

  const updateUserInfo = (zaloUserInfo: ZaloUserInfo) => {
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

  return {
    zaloUserInfo: user,
    phoneNumber: phone,
    logedIn: phone.length > 0,
    updatePhoneNumber: updatePhoneNumber,
    updateUserInfo: updateUserInfo
  };
}