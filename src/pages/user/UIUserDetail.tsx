import React from "react";
import { t } from "i18next";
import { Avatar, Button, Box, Stack, Input, Text } from "zmp-ui";
import { useRecoilValue } from "recoil";

import { userState } from "states";

import UIHeader from "components/common/UIHeader";

function UIUserDetail() {
  const userInfo = useRecoilValue(userState);

  return (
    <div className="container">
      <UIHeader title={t("user")}/>
      
      <Stack space="1rem">
        <Box flex alignItems="center" flexDirection="column">
          <Avatar
            size={96} online
            src={userInfo.avatar.startsWith("http") ? userInfo.avatar : undefined}
          >
            {userInfo.avatar}
          </Avatar>
          <Text.Title>{userInfo.name}</Text.Title>
        </Box>
        <Input.Password value={userInfo.id} label="ID"/>
        <Button> {t("logout")} </Button>
      </Stack>
    </div>
  );
}

export default UIUserDetail;