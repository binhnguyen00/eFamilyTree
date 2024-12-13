import React from "react";
import { t } from "i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { phonePermissionState, phoneState, requestPhoneTriesState, userState } from "states";

export const AutoLoginContext = React.createContext({
  phonePermission: false,
  phoneNumber: "",
  userInfo: {
    id: "",
    avatar: "",
    name: t("account")
  },
});

export function AutoLoginProvider({ children }: { children: React.ReactNode }) {
  const retry = useSetRecoilState(requestPhoneTriesState);
  const permission = useRecoilValue(phonePermissionState);

  let userInfo = {
    id: "",
    avatar: "",
    name: t("account")
  };
  let phoneNumber = ""; 

  if (permission) {
    // Do auto login
  }

  return (
    <AutoLoginContext.Provider value={{
      phonePermission: permission,
      phoneNumber: phoneNumber,
      userInfo: userInfo,
    }}>
      {children}
    </AutoLoginContext.Provider>
  )
}