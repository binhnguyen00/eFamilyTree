import React from "react";
import { t } from "i18next";
import { Box, Stack, Text } from "zmp-ui";

import themeRed from "assets/img/theme/theme-red.jpeg";
import themeGreen from "assets/img/theme/theme-green.jpeg";
import themeBlue from "assets/img/theme/theme-blue.jpeg";

import { useTheme } from "hooks";
import { CommonIcon, SizedBox } from "components";

export default function UIHomeTheme() {

  return (
    <Stack space="0.5rem">

      <Box flex flexDirection="row" justifyContent="space-between">
        <Text.Title size="xLarge" className="text-capitalize"> {t("theme")} </Text.Title>
        <Box flex flexDirection="row" alignItems="center" className="button">
          <Text size="small"> {t("more")} </Text>
          <CommonIcon.ChevonRight size={"1rem"}/>
        </Box>
      </Box>

      <UIThemeList/>

    </Stack>
  )
}

function UIThemeList() {
  const { toggleTheme } = useTheme();

  return (
    <div className="scroll-h flex-h">

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

    </div>
  )
}