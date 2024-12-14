import React from "react";
import { t } from "i18next";
import { Box, Button, Sheet, Stack, Text } from "zmp-ui";

import { ZmpSDK } from "utils";
import { AutoLoginContext, CommonIcon } from "components";

export function RequestPhone(props: { visible: boolean, closeSheet: () => void }) {
  const { updateCtx } = React.useContext(AutoLoginContext);
  const { visible, closeSheet } = props;
  const [ request, setRequest ] = React.useState(false);

  if (request) {
    const success = (number: string) => { 
      setRequest(false);
      ZmpSDK.getUserInfo(
        (userInfo: any) => updateCtx(number, userInfo)
      )
    }
    const fail = (error: any) => { 
      setRequest(false);
      console.error("RequestPhone:\n\t", error) 
    }
    ZmpSDK.getPhoneNumber(success, fail);
  };

  return (
    <Sheet
      visible={visible}
      autoHeight
      mask
      handler
      swipeToClose
      onClose={closeSheet}
      title={t("need_access")}
    >
      <Stack space="1rem" className="p-3">
        <Box flex flexDirection="row" alignItems="center">
          <CommonIcon.Phone size={16}/>
          <Text className="ml-2"> {t("phone_requirement")} </Text>
        </Box>
        <p> {t("request_phone_explaination")} </p>
        <p> {t("commitment")} </p>
        <Stack>
          <Button size="medium" onClick={() => {
            closeSheet();
            setRequest(true);
          }}>
            {t("allow")}
          </Button>
          <Button variant="tertiary" onClick={closeSheet}>
            <Text> {t("decline")} </Text>
          </Button>
        </Stack>
      </Stack>
    </Sheet>
  )
}