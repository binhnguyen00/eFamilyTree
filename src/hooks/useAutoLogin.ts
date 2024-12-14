import React from "react";
import { ZmpSDK } from "utils";
import { AutoLoginContext } from "components";
import { useGetPhonePermission } from "hooks";

interface AutoLoginCtx {
  userInfo: any;
  phoneNumber: string;
  logedIn: boolean;
  login: () => void;
}

export function useAutoLogin(): AutoLoginCtx {
  const [user, setUser] = React.useState<any>({ id: "", name: "", avatar: "" });
  const [phone, setPhoneNumber] = React.useState("");
  const hasPermission = useGetPhonePermission();

  const login = () => {
    ZmpSDK.getSettings(
      (authSetting: any) => {
        if (authSetting["scope.userPhonenumber"]) {
          ZmpSDK.getPhoneNumber(
            (number: string) => {
              setPhoneNumber(number)
              ZmpSDK.getUserInfo(
                (userInfo: any) => setUser(userInfo),
                (error: any) => console.error("useAutoLogin User Info Error:\n\t", error)
              );
            },
            (error: any) => console.error("useAutoLogin Phone Error:\n\t", error)
          );
        }
      },
      (error: any) => console.error("useAutoLogin Settings Error:\n\t", error)
    );
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
    logedIn: !!phone,
    login,
  };
}

export function useLoginContext() {
  return React.useContext(AutoLoginContext);
}