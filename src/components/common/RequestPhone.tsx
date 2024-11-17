import React from "react";
import { t } from "i18next";
import { FaPhoneAlt } from "react-icons/fa";
import { useSetRecoilState } from "recoil";
import { requestPhoneTriesState } from "states";
import { Box, Button, Sheet, Stack, Text } from "zmp-ui";

export default function UIRequestPhone(props: { visible: boolean, closeSheet: () => void }) {
  const { visible, closeSheet } = props;
  const retry = useSetRecoilState(requestPhoneTriesState);

  return (
    <Sheet
      visible={visible}
      autoHeight
      mask
      handler
      swipeToClose
      onClose={closeSheet}
      title={t("need_login")}
      className="text-capitalize"
    >
      <Stack space="1rem" className="p-3">
        <Box flex flexDirection="row" alignItems="center">
          <FaPhoneAlt size={16}/>
          <Text className="ml-2"> {t("phone_requirement")} </Text>
        </Box>
        <Text> {t("login_requirement")} </Text>
        <Stack>
          <Button size="medium" onClick={() => {
            retry(r => r + 1);
            closeSheet();
          }}>
            {t("login")}
          </Button>
          <Button variant="secondary" onClick={closeSheet}>
            <Text> {t("decline")} </Text>
          </Button>
        </Stack>
      </Stack>
    </Sheet>
  )
}