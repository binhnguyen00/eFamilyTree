import React from "react";
import { useTranslation } from "react-i18next";
import { getUserInfo } from "zmp-sdk";
import { Avatar, Button, Box, Stack, Input, Text, useNavigate, Page } from "zmp-ui";
import { selector, useRecoilValue } from "recoil";

import { CommonComponentUtils } from "../../utils/CommonComponent";

export const userState = selector({
  key: "user",
  get: () => {
    return getUserInfo({
      avatarType: "small",
    })
  }
});

export function UIUserHome() {
  const { t } = useTranslation();
  const { userInfo } = useRecoilValue(userState);

  return (
    <Page>
      {CommonComponentUtils.renderHeader(t("user"))}
      
      <div className="container">
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
    </Page>
  );
}

export function UIUser() { 
  let navigate = useNavigate();
  const { userInfo } = useRecoilValue(userState);

  const navigateToUIUser = () => {
    navigate("/user");
  }

  return (
    <Box flex flexDirection="column" alignItems="center">
      <Stack space="1rem">
        <Avatar
          size={96} online className="button"
          src={userInfo.avatar.startsWith("http") ? userInfo.avatar : undefined}
          onClick={navigateToUIUser}
        >
          {userInfo.avatar}
        </Avatar>
        <Text.Title 
          className="button" 
          onClick={() => navigateToUIUser()}
        > {userInfo.name} </Text.Title>
      </Stack>
    </Box>
  )
}