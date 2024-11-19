import React from "react";
import { t } from "i18next";

import { Grid, Stack, Text } from "zmp-ui";

import {  useTheme } from "hooks";
import { Header, SizedBox } from "components";

import themeRed from "assets/img/theme/theme-red.jpeg";
import themeGreen from "assets/img/theme/theme-green.jpeg";
import themeBlue from "assets/img/theme/theme-blue.jpeg";

export default function UITheme() {
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
  const { toggleTheme } = useTheme();

  return (
    <>
      <Stack space="0.5rem" className="center text-capitalize">
        <SizedBox 
          className="button"
          width={150} 
          height={100} 
          border
          onClick={() => toggleTheme("default")}
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
          onClick={() => toggleTheme("blue")}
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
          onClick={() => toggleTheme("green")}
        >
          <img src={themeGreen} alt="theme green"/>
        </SizedBox>
        <Text> {t("theme_green")} </Text>
      </Stack>
    </>
  )
}