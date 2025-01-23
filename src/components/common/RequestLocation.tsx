import React from "react";
import { t } from "i18next";
import { Box, Button, Stack, Text } from "zmp-ui";

import { ZmpSDK } from "utils";

import { CommonIcon, SlidingPanel, SlidingPanelOrient, useAppContext } from "components";

interface RequestLocationProps {
  visible: boolean;
  close: () => void;
}
export function RequestLocation({ visible, close }: RequestLocationProps) {
  const { zaloUserInfo, updateZaloUserInfo } = useAppContext();
  const [ request, setRequest ] = React.useState(false);

  const updateAuthSettings = () => {
    const success = (authSettings) => {
      updateZaloUserInfo({
        ...zaloUserInfo,
        authSettings: authSettings
      })
    }
    ZmpSDK.getAuthSettings(success);
  }

  if (request) {
    const success = (location: any) => { 
      updateAuthSettings();
      setRequest(false);
    }
    const fail = (error: any) => { 
      setRequest(false);
      console.error("RequestLocation:\n\t", error) 
    }
    ZmpSDK.getLocation(success, fail);
  };

  return (
    <SlidingPanel 
      header={<p style={{ fontSize: "1.2rem" }}> {t("need_access")} </p>} 
      visible={visible} 
      orient={SlidingPanelOrient.BottomToTop}
      close={close}
    >
      <Stack space="1rem" className="p-3 text-secondary">
        <Box flexDirection="row" alignItems="center">
          <CommonIcon.Map size={20}/>
          <Text className="ml-2"> {t("location_requirement")} </Text>
        </Box>
        <p> {t("request_location_explaination")} </p>
        <p> {t("commitment")} </p>
        <Stack>
          <Button variant="secondary" size="medium" onClick={() => {
            close();
            setRequest(true);
          }}>
            {t("allow")}
          </Button>
          <Button onClick={close}>
            <Text> {t("decline")} </Text>
          </Button>
        </Stack>
      </Stack>
    </SlidingPanel>
  )
}