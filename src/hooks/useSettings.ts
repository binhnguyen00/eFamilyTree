import React from "react";
import { useTranslation } from 'react-i18next';

import { UserSettingApi } from "api";
import { useTheme, useOverlayContext } from "hooks";
import { FailResponse, ServerResponse, UserSettings, UserSettingsContext, Language, Theme } from "types";

export function useSettings(userId: number | any, clanId: number | any): UserSettingsContext {
  const { i18n } = useTranslation();
  const { toggleTheme } = useTheme();
  const { greetings } = useOverlayContext();
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
    toggleTheme(theme);
  }

  const updateLanguage = (language: Language) => {
    setSetting({
      ...settings,
      language: language
    })
    i18n.changeLanguage(language);
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

    UserSettingApi.getOrDefault({ 
      userId: userId, 
      clanId: clanId, 
      success: (result: ServerResponse) => {
        const settings: any = result.data;
        if (settings.introduction_period === 0) {
          greetings();
        }
        setSetting({
          id:                 settings.id,
          theme:              settings.theme,
          language:           settings.language,
          background:         settings.background,
          introductionPeriod: settings.introduction_period
        });
      },
      fail: (error: FailResponse) => {
        console.error("Get default settings fail:\n", error.message);
      }
    });

  }, [ userId, clanId ])

  React.useEffect(() => {
    toggleTheme(settings.theme);
    i18n.changeLanguage(settings.language);
  }, [ settings ])

  return { 
    settings, 
    updateSettings, 
    updateBackground, 
    updateTheme, 
    updateLanguage, 
    updateIntroductionPeriod,
  } as UserSettingsContext;
}