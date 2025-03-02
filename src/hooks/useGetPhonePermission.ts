import React from "react";
import { ZmpSDK } from "utils";

export function useGetPhonePermission() {
  const [ permission, setPermission ] = React.useState(false);

  React.useEffect(() => {
    const success = (authSetting: any) => {
      setPermission(!!authSetting["scope.userPhonenumber"]);
    };
    const fail = (error: any) => {};
    ZmpSDK.getAuthSettings({
      successCB: success,
    });
  }, []);

  return permission;
}