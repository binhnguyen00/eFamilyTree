import React from "react";

import { UserSettingApi } from "api";
import { CommonUtils } from "utils";
import { FailResponse, ServerResponse } from "server";

interface Settings {
  theme: "default" | "blue" | "green",
  language: "vi" | "en"
}

export function useSetting(phoneNumber: string): Settings {
  let [ setting, setSetting ] = React.useState<Settings>({
    theme: "default",
    language: "vi"
  });

  React.useEffect(() => {
    if (phoneNumber && !CommonUtils.isStringEmpty(phoneNumber)) {
      const success = (result: ServerResponse) => {
        const setting = result.data;
        setSetting(setting);
      }
      const fail = (error: FailResponse) => {
        console.error(error);
      }
      UserSettingApi.getOrDefault(phoneNumber, success, fail);
    }
  }, [phoneNumber])

  return setting;
}