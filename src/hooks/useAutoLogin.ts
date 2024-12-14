import React from "react";

import { ZmpSDK } from "utils";
import { AutoLoginContext } from "components";
import { useGetPhonePermission } from "hooks";

interface AutoLoginProps {
  update: (phone: string, user: any) => void;
  dependencies?: any[]
}
export function useAutoLogin(props: AutoLoginProps) {
  let { update, dependencies = [] } = props;

  let [ hasPermission, setPermission ] = React.useState(false);
  let [ phoneNumber, setPhone ] = React.useState("");
  let [ userInfo, setUser ] = React.useState<any>(null);

  useGetPhonePermission({ 
    returnValue: (permission: boolean) => {
      if (permission) 
        setPermission(true);
      else 
        setPermission(false);
    } 
  });

  React.useEffect(() => {
    if (hasPermission) {
      ZmpSDK.getUserInfo(
        (user: any) => setUser(user),
        (error: any) => console.error(error)
      )
      ZmpSDK.getPhoneNumber(
        (number: string) => setPhone(number),
        (error: any) => console.error(error)
      );
      update(phoneNumber, userInfo);
    }
  }, [ ...dependencies ]);
}

export function useLoginContext() {
  return React.useContext(AutoLoginContext);
}