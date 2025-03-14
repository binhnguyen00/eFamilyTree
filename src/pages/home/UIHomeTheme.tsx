import React from "react";
import { t } from "i18next";
import { Box, Button, Text } from "zmp-ui";

import { CommonIcon } from "components";
import { UIThemeList } from "pages/theme/UITheme";
import { useAccountContext, useRequestPhoneContext, useRouteNavigate } from "hooks";

export function UIHomeTheme() {
  const { 
    needRegisterClan, registerClan, 
    needRegisterAccount, registerAccount } = useAccountContext();
  const { needPhone, requestPhone } = useRequestPhoneContext();
  const { goTo } = useRouteNavigate();

  const onGoToTheme = () => {
    if (needPhone) { requestPhone(); return; }
    else if (needRegisterClan) { registerClan(); return; } 
    else if (needRegisterAccount) { registerAccount(); return; }
    else goTo({ path: "theme" })
  }

  return (
    <div className="flex-v">

      <div className="flex-h justify-between">
        <Text.Title size="xLarge" className="text-capitalize text-shadow"> {t("theme")} </Text.Title>
        <Button 
          size="small" variant="secondary" 
          suffixIcon={<CommonIcon.ChevonRight size={"1rem"}/>} 
          onClick={onGoToTheme}
        >
          {t("more")}
        </Button>
      </div>

      <div className="scroll-h flex-h">
        <UIThemeList/>
      </div>
      
    </div>
  )
}