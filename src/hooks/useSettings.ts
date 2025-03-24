import React from "react";
import { useTranslation } from 'react-i18next';

import { useTheme } from "hooks";
import { UserSettingApi } from "api";

import { FailResponse, ServerResponse } from "types/server";
import { UserSettings, UserSettingsContext, Language, Theme } from "types/user-settings";

export function useSettings(userId: number | any, clanId: number | any): UserSettingsContext {
  const { i18n } = useTranslation();
  const { toggleTheme } = useTheme();
  const [ settings, setSetting ] = React.useState<UserSettings>({
    id: 0,
    theme: Theme.DEFAULT,
    language: Language.VI,
    background: {
      id: 0,
      path: ""
    },
    introductionPeriod: 0
  });

  const updateBackground = (background: { id: number, path: string }) => {
    setSetting({
      ...settings,
      background: background
    })
  }

  const updateTheme = (theme: Theme) => {
    setSetting({
      ...settings,
      theme: theme
    })
  }

  const updateLanguage = (language: Language) => {
    setSetting({
      ...settings,
      language: language
    })
  }

  const updateIntroductionPeriod = (introductionPeriod: number) => {
    setSetting({
      ...settings,
      introductionPeriod: introductionPeriod
    })
  }

  const updateSettings = (userSettings: UserSettings) => {
    setSetting(userSettings);
  }

  React.useEffect(() => {
    if (!userId || !clanId) return;

    UserSettingApi.getOrDefault({ 
      userId: userId, 
      clanId: clanId, 
      success: (result: ServerResponse) => {
        const settings: UserSettings = result.data;
        updateTheme(settings.theme);
        updateLanguage(settings.language);
        updateBackground(settings.background);
        updateIntroductionPeriod(settings.introductionPeriod);
      }, 
      fail: (error: FailResponse) => {
        console.error(error.message);
        updateSettings({
          id: 0,
          theme: Theme.DEFAULT,
          language: Language.VI,
          background: {
            id: 0,
            path: ""
          },
          introductionPeriod: 0
        });
      }
    });

  }, [ userId, clanId ])

  React.useEffect(() => {
    toggleTheme(settings.theme);
    i18n.changeLanguage(settings.language);
    // TODO: Toggle Introduction Period
  }, [ settings ])

  return { settings, updateSettings, updateBackground, updateTheme, updateLanguage, updateIntroductionPeriod };
}