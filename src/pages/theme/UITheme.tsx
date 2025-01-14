import React from "react";
import { t } from "i18next";

import { Grid, Stack, Text } from "zmp-ui";

import { UserSettingApi } from "api";
import { useAppContext } from "hooks";
import { Header, SizedBox } from "components";

import { Theme } from "types/user-settings";
import { FailResponse, ServerResponse } from "types/server";

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
  const { userInfo, settings, updateSettings } = useAppContext();

  const saveTheme = (theme: Theme) => {
    const success = (result: ServerResponse) => {
      const settings = result.data;
      updateSettings(settings)
    }
    const fail = (error: FailResponse) => {
      console.error(error);
    }
    const target = {
      ...settings,
      theme: theme
    }
    UserSettingApi.updateOrCreate(userInfo.id, userInfo.clanId, target, success, fail);
  }

  return (
    <>
      <Stack space="0.5rem" className="center text-capitalize">
        <SizedBox 
          className="button"
          width={150} 
          height={100} 
          border
          onClick={() => saveTheme(Theme.DEFAULT)}
        >
          <img src={themeRed} alt="theme red"/>
        </SizedBox>
        <Text> {t("theme_red")} </Text>
      </Stack>

      <Stack space="0.5rem" className="center text-capitalize">
        <SizedBox 
          className="button"
          width={150} 
          height={100} 
          border
          onClick={() => saveTheme(Theme.BLUE)}
        >
          <img src={themeBlue} alt="theme blue"/>
        </SizedBox>
        <Text> {t("theme_blue")} </Text>
      </Stack>

      <Stack space="0.5rem" className="center text-capitalize">
        <SizedBox 
          className="button"
          width={150} 
          height={100} 
          border
          onClick={() => saveTheme(Theme.GREEN)}
        >
          <img src={themeGreen} alt="theme green"/>
        </SizedBox>
        <Text> {t("theme_green")} </Text>
      </Stack>
    </>
  )
}