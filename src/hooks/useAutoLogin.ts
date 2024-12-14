import React from "react";

import { ZmpSDK } from "utils";
import { AutoLoginContext } from "components";
import { useGetPhonePermission } from "hooks";

interface AutoLoginProps {
  update: (phone: string, user: any) => void;
}
export function useAutoLogin(props: AutoLoginProps) {
  let { update } = props;

  let [ hasPermission, setPermission ] = React.useState(false);
  let [ user, setUser ] = React.useState(null);
  let [ phone, setPhoneNumber ] = React.useState("");

  useGetPhonePermission({ 
    returnValue: (permission: boolean) => {
      if (permission) setPermission(true);
    } 
  });

  React.useEffect(() => {
    update(phone, user);
  }, [phone, user, update]);

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
}

export function useLoginContext() {
  return React.useContext(AutoLoginContext);
}