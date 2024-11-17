import React from "react";
import { t } from "i18next";
import { Box, Stack, Text } from "zmp-ui";

import { CommonIcon, SizedBox, useTheme } from "components";

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

      <Stack space="0.5rem">
        <SizedBox 
          className="button"
          width={150} 
          height={100} 
          border
          onClick={() => toggleTheme("default")}
        >
          {"default"}
        </SizedBox>
      </Stack>

      <Stack space="0.5rem">
        <SizedBox 
          className="button"
          width={150} 
          height={100} 
          border
          onClick={() => toggleTheme("blue")}
        >
          {"blue"}
        </SizedBox>
      </Stack>

      <Stack space="0.5rem">
        <SizedBox 
          className="button"
          width={150} 
          height={100} 
          border
          onClick={() => toggleTheme("green")}
        >
          {"default"}
        </SizedBox>
      </Stack>

    </div>
  )
}