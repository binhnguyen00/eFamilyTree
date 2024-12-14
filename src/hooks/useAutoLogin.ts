import React from "react";

import { ZmpSDK } from "utils";
import { AutoLoginContext } from "components";
import { useGetPhonePermission } from "hooks";

export function useAutoLogin() {
  let [ user, setUser ] = React.useState(null);
  let [ phone, setPhoneNumber ] = React.useState("");

  const hasPermission = useGetPhonePermission();

  React.useEffect(() => {
    if (hasPermission) {
      ZmpSDK.getUserInfo(
        (userInfo: any) => setUser(userInfo),
        (error: any) => console.error("useAutoLogin:\n\t", error)
      );
      ZmpSDK.getPhoneNumber(
        (number: string) => setPhoneNumber(number),
        (error: any) => console.error("useAutoLogin:\n\t", error)
      );
    }
  }, [hasPermission]);

  return {
    userInfo: user,
    phoneNumber: phone,
    logedIn: phone.length > 0
  } as any;
}

export function useLoginContext() {
  return React.useContext(AutoLoginContext);
}