import React from "react";
import { t } from "i18next";
import { useTranslation } from 'react-i18next';

import { useTheme, useOverlayContext } from "hooks";
import { UserSettingApi } from "api";

import { FailResponse, ServerResponse } from "types/server";
import { UserSettings, UserSettingsContext, Language, Theme } from "types/user-settings";

export function useSettings(userId: number | any, clanId: number | any): UserSettingsContext {
  let { i18n } = useTranslation();
  let { toggleTheme } = useTheme();
  let { open } = useOverlayContext();
  let [ settings, setSetting ] = React.useState<UserSettings>({
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
    greetings();
  }

  const updateSettings = (userSettings: UserSettings) => {
    setSetting(userSettings);
  }

  const getIntroductionPage = (): React.ReactNode => {
    return (
      <div>
        <h1> greeting user </h1>
      </div>
    )
  }

  const greetings = () => {
    const needGreetings = settings.introductionPeriod === 0;
    if (settings.id && needGreetings) {
      open({
        title: t("Chào mừng đến với Gia Phả Lạc Hồng"),
        content: getIntroductionPage()
      });
    }
  }

  React.useEffect(() => {
    if (!userId || !clanId) return;

    UserSettingApi.getOrDefault({ 
      userId: userId, 
      clanId: clanId, 
      success: (result: ServerResponse) => {
        const settings: any = result.data;
        setSetting({
          id:                 settings.id,
          theme:              settings.theme,
          language:           settings.language,
          background:         settings.background,
          introductionPeriod: settings.introduction_period
        });
      }, 
      fail: (error: FailResponse) => {}
    });

  }, [ userId, clanId ])

  React.useEffect(() => {
    toggleTheme(settings.theme);
    i18n.changeLanguage(settings.language);
    greetings();
  }, [ settings ])

  return { 
    settings, 
    updateSettings, 
    updateBackground, 
    updateTheme, 
    updateLanguage, 
    updateIntroductionPeriod,
    greetings,
  };
}