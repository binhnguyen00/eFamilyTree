import React from "react";
import { t } from "i18next";
import { useSetRecoilState } from "recoil";
import { requestPhoneTriesState } from "states";

import { Avatar, Box, Button, Stack, Text } from "zmp-ui";

interface UISignedInUserProps {
  userInfo: any;
}
export default function UISignedInUser({ userInfo }: UISignedInUserProps) {
  const retry = useSetRecoilState(requestPhoneTriesState);

  return (
    <Stack space="1rem">

      <Box flex flexDirection="column" alignItems="center">
        <Avatar
          size={60} online className="button"
          src={userInfo.avatar.startsWith("http") ? userInfo.avatar : undefined}
        >
          {userInfo.avatar}
        </Avatar>
        <Text.Title> {userInfo.name} </Text.Title>
      </Box>

      <Button variant="secondary">
        {t("about")}
      </Button>

      <Button variant="secondary">
        {t("register_clan")}
      </Button>

      <button onClick={() => retry(0)}>
        {t("logout")}
      </button>

    </Stack>
  )
}