import React from "react";
import { t } from "i18next";
import { Box, Button, Text } from "zmp-ui";

import { CommonIcon } from "components";
import { UIThemeList } from "pages/theme/UITheme";
import { useRouteNavigate } from "hooks";

export function UIHomeTheme() {
  const { goTo } = useRouteNavigate();

  return (
    <div className="flex-v">

      <Box flex flexDirection="row" justifyContent="space-between">
        <Text.Title size="xLarge" className="text-capitalize text-shadow"> {t("theme")} </Text.Title>
        <Box flex flexDirection="row" alignItems="center" alignContent="center" className="button">
          <Button size="small" variant="secondary" suffixIcon={<CommonIcon.ChevonRight size={"1rem"}/>} onClick={() => goTo({ path: "theme" })}>
            <Text> {t("more")} </Text>
          </Button>
        </Box>
      </Box>

      <div className="scroll-h flex-h">
        <UIThemeList/>
      </div>

    </div>
  )
}