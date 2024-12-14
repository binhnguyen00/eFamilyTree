import React from "react";
import { ZmpSDK } from "utils";

export function useGetPhonePermission() {
  let [ permission, setPermission ] = React.useState(false);

  React.useEffect(() => {
    const success = (authSetting: any) => {
      setPermission(authSetting["scope.userPhonenumber"]);
    }
    const fail = (error: any) => {
      fail(error);
    }
    ZmpSDK.getSettings(success, fail);
  }, [ permission ])

  return permission;
}