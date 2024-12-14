import React from "react";
import { ZmpSDK } from "utils";
import { AutoLoginContext } from "components";
import { useGetPhonePermission } from "hooks";

interface AutoLoginCtx {
  userInfo: any;
  phoneNumber: string;
  logedIn: boolean;
  updateCtx: (phoneNumber: string, userInfo: any) => void;
}

export function useAutoLogin(): AutoLoginCtx {
  const [ user, setUser ] = React.useState<any>({ id: "", name: "", avatar: "" });
  const [ phone, setPhoneNumber ] = React.useState("");
  const hasPermission = useGetPhonePermission();

  const updateCtx = (phoneNumber: string, userInfo: any) => {
    setPhoneNumber(phoneNumber);
    setUser(userInfo);
  };

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
    updateCtx: updateCtx,
  };
}

export function useLoginContext() {
  return React.useContext(AutoLoginContext);
}