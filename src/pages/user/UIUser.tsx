import React from "react";
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
  const { userInfo } = useRecoilValue(userState);

  return (
    <Page className="page" style={{ marginTop: 44 }}>
      {CommonComponentUtils.renderHeader("User")}
      
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
        <Button> {"Logout"} </Button>
      </Stack>
    </Page>
  );
}

export function UIUser() { 
  let navigate = useNavigate();
  const { userInfo } = useRecoilValue(userState);

  const navigateToUIUser = () => {
    navigate("/user");
    navigate = undefined as any;
  }

  return (
    <Box flex flexDirection="column" alignItems="center">
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
    </Box>
  )
}