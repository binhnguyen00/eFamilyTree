import React from "react";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

import { Avatar, Box, Button, Stack, Text } from "zmp-ui";

interface UISignedInUserProps {
  userInfo: any;
}
export default function UISignedInUser({ userInfo }: UISignedInUserProps) {
  const navigate = useNavigate();

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

      <Button variant="secondary" onClick={() => navigate("/register-clan")}>
        {t("register_clan")}
      </Button>

      <Button variant="secondary" onClick={() => navigate("/about")}>
        {t("about")}
      </Button>

    </Stack>
  )
}