import { t } from "i18next";
import React from "react";

import { Avatar, Box, Button, Stack, Switch, Text } from "zmp-ui";

interface UISignedInUserProps {
  userInfo: any;
}
export default function UISignedInUser({ userInfo }: UISignedInUserProps) {

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

      <Switch label={t("vietnamese")} />

    </Stack>
  )
}