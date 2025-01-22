import React from "react";
import { t } from "i18next";

import { Grid, Stack, Text } from "zmp-ui";

import { UserSettingApi } from "api";
import { useAppContext } from "hooks";
import { Header, SizedBox } from "components";

import { Theme } from "types/user-settings";
import { ServerResponse } from "types/server";

import themeRed from "assets/img/theme/theme-red.jpeg";
import themeGreen from "assets/img/theme/theme-green.jpeg";
import themeBlue from "assets/img/theme/theme-blue.jpeg";

export function UITheme() {
  return (
    <div className="container">
      <Header title={t("theme")}/>

      <Grid columnSpace="1rem" rowSpace="1rem" columnCount={2}>
        <UIThemeList/>
      </Grid>
    </div>
  )
}

export function UIThemeList() {
  return (
    <>
      <ThemeCard theme={Theme.DEFAULT} src={themeRed}/>
      <ThemeCard theme={Theme.BLUE} src={themeBlue}/>
      <ThemeCard theme={Theme.GREEN} src={themeGreen}/>
    </>
  )
}

function ThemeCard({ theme, src }: { theme: Theme, src: string }) {
  const { userInfo, settings, updateSettings } = useAppContext();

  const saveTheme = (theme: Theme) => {
    const success = (result: ServerResponse) => {
      const settings = result.data;
      updateSettings(settings)
    }
    const target = {
      ...settings,
      theme: theme
    }
    UserSettingApi.updateOrCreate(userInfo.id, userInfo.clanId, target, success);
  }

  return (
    <Stack space="0.5rem" className="center text-capitalize">
      <SizedBox 
        className="button"
        width={150} height={100} border
        onClick={() => saveTheme(theme)}
      >
        <img src={src} alt="theme green"/>
      </SizedBox>
      <Text className="text-primary bold"> {t("theme_green")} </Text>
    </Stack>
  )
}