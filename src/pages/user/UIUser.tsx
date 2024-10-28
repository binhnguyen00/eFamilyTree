import React from "react";
import { getUserInfo } from "zmp-sdk";
import { Avatar, Button, Box, Page, Stack, Input, Text } from "zmp-ui";
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
  const { userInfo } = useRecoilValue(userState);

  return (
    <Page className="page">
      {CommonComponentUtils.renderHeader("User")}
      
      <Stack space="1rem">
        <Box flex alignItems="center" flexDirection="column">
          <Avatar
            size={96} online story="default"
            src={userInfo.avatar.startsWith("http") ? userInfo.avatar : undefined}
          >
            {userInfo.avatar}
          </Avatar>
          <p>{userInfo.name}</p>
        </Box>
        <Input.Password value={userInfo.id} label="ID"/>
        <Button> {"Logout"} </Button>
      </Stack>
    </Page>
  );
}

export function UIUser() { 
  const { userInfo } = useRecoilValue(userState);

  return (
    <Box flex flexDirection="column" alignItems="center">
      <Avatar
        size={96} online story="default" className="button"
        src={userInfo.avatar.startsWith("http") ? userInfo.avatar : undefined}
      >
        {userInfo.avatar}
      </Avatar>
      <Text.Title className="button"> {userInfo.name} </Text.Title>
    </Box>
  )
}