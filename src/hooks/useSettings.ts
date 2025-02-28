import React from "react";
import { useTranslation } from 'react-i18next';

import { useTheme } from "hooks";
import { UserSettingApi } from "api";

import { FailResponse, ServerResponse } from "types/server";
import { UserSettings, UserSettingsContext, Language, Theme } from "types/user-settings";

export function useSettings(userId: number | any, clanId: number | any): UserSettingsContext {
  let { i18n } = useTranslation();
  let { toggleTheme } = useTheme();
  let [ settings, setSetting ] = React.useState<UserSettings>({
    theme: Theme.DEFAULT,
    language: Language.VI,
    background: {
      id: 0,
      path: ""
    }
  });

  const updateSettings = (userSettings: UserSettings) => {
    setSetting(userSettings);
  }

  // Update Settings effect if has any changes
  React.useEffect(() => {
    if (Object.values(Theme).includes(settings.theme)) {
      toggleTheme(settings.theme);
    }
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