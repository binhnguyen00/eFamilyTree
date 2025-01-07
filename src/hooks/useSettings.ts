import React from "react";
import { useTranslation } from 'react-i18next';

import { useTheme } from "hooks";
import { UserSettingApi } from "api";
import { CommonUtils } from "utils";
import { Theme } from "components";
import { FailResponse, ServerResponse } from "server";

export interface Settings {
  theme: Theme,
  language: "vi" | "en"
  background?: {
    id: number,
    path: string
  };
}

interface SettingCtx {
  settings: Settings,
  updateSettings: (settings: Settings) => void
}

export function useSettings(userId: number | any, clanId: number | any): SettingCtx {
  let { i18n } = useTranslation();
  let { toggleTheme } = useTheme();
  let [ settings, setSetting ] = React.useState<Settings>({
    theme: Theme.DEFAULT,
    language: "vi",
    background: {
      id: 0,
      path: ""
    }
  });

  const updateSettings = (userSettings: Settings) => {
    console.log("Update Settings", userSettings);
    setSetting(userSettings);
  }

  // Update Settings effect if has any changes
  React.useEffect(() => {
    toggleTheme(settings.theme);
    i18n.changeLanguage(settings.language);
  }, [settings])

  // Get user settings
  React.useEffect(() => {
    if (userId) {
      // Get theme, language
      const success = (result: ServerResponse) => {
        const settings = result.data;
        // Get background
        UserSettingApi.getBackground(
          userId, clanId, 
          (result: ServerResponse) => {
            const bg = result.data;
            setSetting({
              ...settings,
              background: {
                id: bg["id"],
                path: bg["path"]
              }
            })
          },
          (error: FailResponse) => console.error(error)
        )
      }
      const fail = (error: FailResponse) => console.error(error)
      UserSettingApi.getOrDefault(userId, clanId, success, fail);

    }
  }, [ userId, clanId ])

  return {
    settings: settings,
    updateSettings: updateSettings
  };
}