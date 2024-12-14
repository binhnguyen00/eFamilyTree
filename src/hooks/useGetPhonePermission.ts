import React from "react";
import { ZmpSDK } from "utils";

interface PhonePermissionHookProps {
  returnValue: (hasPermission: boolean) => void;
}
export function useGetPhonePermission(props: PhonePermissionHookProps) {
  let { returnValue } = props;
  React.useEffect(() => {
    const success = (authSetting: any) => {
      returnValue(authSetting["scope.userPhonenumber"]);
    }
    const fail = (error: any) => {
      fail(error);
    }
    ZmpSDK.getSettings(success, fail);
  }, []);
}