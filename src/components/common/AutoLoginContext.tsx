import React from "react";
import { t } from "i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { hasPhonePermission, phoneState, requestPhoneTriesState, userState } from "states";

export const AutoLoginContext = React.createContext({
  phonePermission: false,
  userInfo: {
    id: "",
    avatar: "",
    name: t("account"),
  },
  phoneNumber: "",
});

export function AutoLoginContextProvider({ children }: { children: React.ReactNode }) {
  const phonePermission = useRecoilValue(hasPhonePermission);
  let userInfo = {
    id: "",
    avatar: "",
    name: t("account"),
  };
  let phoneNumber = "";

  console.log("phonePermission", phonePermission);

  if (phonePermission) { // Do auto login
    const retry = useSetRecoilState(requestPhoneTriesState);
    retry(r => r + 1);
    phoneNumber = useRecoilValue(phoneState);
    userInfo = useRecoilValue(userState);
  }

  return (
    <AutoLoginContext.Provider 
      value={{ 
        phonePermission: phonePermission,
        userInfo: userInfo,
        phoneNumber: phoneNumber,
      }}
    >
      {children}
    </AutoLoginContext.Provider>
  );
}