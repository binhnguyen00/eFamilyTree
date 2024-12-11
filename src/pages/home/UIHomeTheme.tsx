import React from "react";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { Box, Button, Stack, Text } from "zmp-ui";

import { CommonIcon } from "components";
import { UIThemeList } from "pages/theme/UITheme";

export function UIHomeTheme() {
  const navigate = useNavigate();

  return (
    <Stack space="0.5rem">

      <Box flex flexDirection="row" justifyContent="space-between">
        <Text.Title size="xLarge" className="text-capitalize text-shadow"> {t("theme")} </Text.Title>
        <Box flex flexDirection="row" alignItems="center" alignContent="center" className="button">
          <Button size="small" variant="secondary" suffixIcon={<CommonIcon.ChevonRight size={"1rem"}/>} onClick={() => navigate("/theme")}>
            <Text> {t("more")} </Text>
          </Button>
        </Box>
      </Box>

      <div className="scroll-h flex-h">
        <UIThemeList/>
      </div>

    </Stack>
  )
}