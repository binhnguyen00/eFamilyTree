import React from "react";
import { useTranslation } from 'react-i18next';

import { useTheme } from "hooks";
import { UserSettingApi } from "api";
import { CommonUtils } from "utils";
import { Theme } from "components";
import { FailResponse, ServerResponse } from "server";

interface Settings {
  theme: Theme,
  language: "vi" | "en"
}

interface SettingCtx {
  settings: Settings,
  updateSettings: (settings: Settings) => void
}

export function useSettings(phoneNumber: string): SettingCtx {
  let { i18n } = useTranslation();
  let { toggleTheme } = useTheme();
  let [ settings, setSetting ] = React.useState<Settings>({
    theme: Theme.DEFAULT,
    language: "vi"
  });

  const updateSettings = (userSettings: Settings) => {
    setSetting(userSettings);
  }

  // Update Settings effect if has any changes
  React.useEffect(() => {
    toggleTheme(settings.theme);
    i18n.changeLanguage(settings.language);
  }, [settings])

  // Get user settings
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