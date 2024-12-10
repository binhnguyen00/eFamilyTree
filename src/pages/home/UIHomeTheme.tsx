import React from "react";
import { t } from "i18next";
import { Box, Stack, Text, useNavigate } from "zmp-ui";

import { CommonIcon } from "components";
import { UIThemeList } from "pages/theme/UITheme";

export function UIHomeTheme() {
  const navigate = useNavigate();

  return (
    <Stack space="0.5rem">

      <Box flex flexDirection="row" justifyContent="space-between" onClick={() => navigate("/theme")}>
        <Text.Title size="xLarge" className="text-capitalize"> {t("theme")} </Text.Title>
        <Box flex flexDirection="row" alignItems="center" className="button">
          <Text size="small"> {t("more")} </Text>
          <CommonIcon.ChevonRight size={"1rem"}/>
        </Box>
      </Box>

      <div className="scroll-h flex-h">
        <UIThemeList/>
      </div>

    </Stack>
  )
}