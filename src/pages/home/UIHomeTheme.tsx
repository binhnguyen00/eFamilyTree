import React from "react";
import { t } from "i18next";
import { Box, Stack, Text } from "zmp-ui";

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
  const themes = [
    "default", "blue", "green"
  ]

  const toggleTheme = (themeCode: string) => {
    document.documentElement.setAttribute("data-theme", themeCode);
  };

  let html = [] as React.ReactNode[]; 

  themes.forEach((themeCode: string, i: number) => {
    html.push(
      <Stack key={`theme-${i}`} space="0.5rem">
        <SizedBox 
          className="button border"
          width={150} 
          height={100} 
          content={themeCode} 
          onClick={() => toggleTheme(themeCode)}
        />
      </Stack>
    )
  })

  return (
    <div className="scroll-h flex-h">
      {html}
    </div>
  )
}