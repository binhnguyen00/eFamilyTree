import React from "react";
import { ZmpSDK } from "utils";

export function useGetPhonePermission() {
  const [permission, setPermission] = React.useState(false);

  React.useEffect(() => {
    const success = (authSetting: any) => {
      setPermission(!!authSetting["scope.userPhonenumber"]);
    };
    const fail = (error: any) => {
      console.error("useGetPhonePermission:\n\t", error);
    };
    ZmpSDK.getSettings(success, fail);
  }, []); // Empty dependency array to avoid infinite loop.

  return permission;
}