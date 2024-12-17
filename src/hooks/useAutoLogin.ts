import React from "react";
import { ZmpSDK } from "utils";
import { useGetPhonePermission } from "hooks";

interface UserInfo {
  id: string;
  name: string;
  avatar: string;
}

interface AutoLoginCtx {
  userInfo: UserInfo;
  phoneNumber: string;
  logedIn: boolean;
  updatePhoneNumber: (phoneNumber: string) => void;
  updateUserInfo: (userInfo: UserInfo) => void;
}

export function useAutoLogin(): AutoLoginCtx {
  const [ user, setUser ] = React.useState<UserInfo>({ id: "", name: "", avatar: "" });
  const [ phone, setPhoneNumber ] = React.useState<string>("");
  const hasPermission = useGetPhonePermission();

  const updatePhoneNumber = (phoneNumber: string) => {
    setPhoneNumber(phoneNumber);
  }

  const updateUserInfo = (userInfo: UserInfo) => {
    setUser(userInfo);
  }

  React.useEffect(() => {
    if (hasPermission) {
      ZmpSDK.getUserInfo(
        (userInfo: any) => setUser(userInfo),
        (error: any) => console.error("useAutoLogin User Info Error:\n\t", error)
      );
      ZmpSDK.getPhoneNumber(
        (number: string) => setPhoneNumber(number),
        (error: any) => console.error("useAutoLogin Phone Error:\n\t", error)
      );
    }
  }, [hasPermission]);

  return {
    userInfo: user,
    phoneNumber: phone,
    logedIn: phone.length > 0,
    updatePhoneNumber: updatePhoneNumber,
    updateUserInfo: updateUserInfo
  };
}