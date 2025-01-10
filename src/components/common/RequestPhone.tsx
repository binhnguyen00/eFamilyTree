import React from "react";
import { t } from "i18next";
import { Box, Button, Stack, Text } from "zmp-ui";

import { ZmpSDK } from "utils";
import { useAppContext } from "hooks";
import { CommonIcon, SlidingPanel, SlidingPanelOrient } from "components";

export function RequestPhone(props: { visible: boolean, closeSheet: () => void }) {
  const { updatePhoneNumber, updateUserInfo } = useAppContext();
  const { visible, closeSheet } = props;
  const [ request, setRequest ] = React.useState(false);

  if (request) {
    const success = (number: string) => { 
      setRequest(false);
      ZmpSDK.getUserInfo(
        (userInfo: any) => {
          updatePhoneNumber(number);
          updateUserInfo(userInfo);
        }
      )
    }
    const fail = (error: any) => { 
      setRequest(false);
      console.error("RequestPhone:\n\t", error) 
    }
    ZmpSDK.getPhoneNumber(success, fail);
  };

  return (
    <SlidingPanel 
      header={<p style={{ fontSize: "1.2rem" }}> {t("need_access")} </p>} 
      visible={visible} 
      orient={SlidingPanelOrient.BottomToTop}
      close={closeSheet}
    >
      <Stack space="1rem" className="p-3 text-secondary">
        <Box flexDirection="row" alignItems="center">
          <CommonIcon.Phone size={16}/>
          <Text className="ml-2"> {t("phone_requirement")} </Text>
        </Box>
        <p> {t("request_phone_explaination")} </p>
        <p> {t("commitment")} </p>
        <Stack>
          <Button variant="secondary" size="medium" onClick={() => {
            closeSheet();
            setRequest(true);
          }}>
            {t("allow")}
          </Button>
          <Button onClick={closeSheet}>
            <Text> {t("decline")} </Text>
          </Button>
        </Stack>
      </Stack>
    </SlidingPanel>
  )
}