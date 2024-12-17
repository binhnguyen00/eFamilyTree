import React from "react";

import { UserSettingApi } from "api";
import { CommonUtils } from "utils";
import { FailResponse, ServerResponse } from "server";

interface Settings {
  theme: "default" | "blue" | "green",
  language: "vi" | "en"
}

interface SettingCtx {
  settings: Settings,
  updateSettings: (settings: Settings) => void
}

export function useSetting(phoneNumber: string): SettingCtx {
  let [ settings, setSetting ] = React.useState<Settings>({
    theme: "default",
    language: "vi"
  });

  const updateSettings = (userSettings: Settings) => {
    setSetting(userSettings);
  }

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

  return {
    settings: settings,
    updateSettings: updateSettings
  };
}