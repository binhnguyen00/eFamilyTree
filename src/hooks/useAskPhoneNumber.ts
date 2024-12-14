import React from "react";
import { ZmpSDK } from "utils";

interface AskPhoneNumberProps {
  returnValue: (phoneNumber: string) => void;
}
export function useAskPhoneNumber(props: AskPhoneNumberProps) {
  let { returnValue } = props;
  React.useEffect(() => {

    const fail = (error: any) => {
      console.error("useAskPhonePermission:\n\t", error);
    }

    ZmpSDK.getPhoneNumber(returnValue, fail);
  }, [  ])
}