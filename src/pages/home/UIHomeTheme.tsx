import React from "react";
import { t } from "i18next";
import { Box, Button, Text } from "zmp-ui";

import { CommonIcon, RequestPhone } from "components";
import { UIThemeList } from "pages/theme/UITheme";
import { useAppContext, useRouteNavigate } from "hooks";

export function UIHomeTheme() {
  const { logedIn } = useAppContext();
  const { goTo } = useRouteNavigate();
  const [ requestPhone, setRequestPhone ] = React.useState<boolean>(false);

  const onGoToTheme = () => {
    if (!logedIn) {
      setRequestPhone(true);
    } else {
      goTo({ path: "theme" })
    }
  }

  return (
    <div className="flex-v">

      <Box flex flexDirection="row" justifyContent="space-between">
        <Text.Title size="xLarge" className="text-capitalize text-shadow"> {t("theme")} </Text.Title>
        <Box flex flexDirection="row" alignItems="center" alignContent="center" className="button">
          <Button 
            size="small" 
            variant="secondary" 
            suffixIcon={<CommonIcon.ChevonRight size={"1rem"}/>} 
            onClick={onGoToTheme}
          >
            <Text> {t("more")} </Text>
          </Button>
        </Box>
      </Box>

      <div className="scroll-h flex-h">
        <UIThemeList requestPhone={() => setRequestPhone(true)}/>
      </div>

      <RequestPhone
        visible={requestPhone}
        closeSheet={() => setRequestPhone(false)}
      />

    </div>
  )
}