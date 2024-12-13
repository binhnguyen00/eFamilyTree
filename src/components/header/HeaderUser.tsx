import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Text } from "zmp-ui";

import UNKNOWN_AVATAR from "assets/img/unknown-person.jpeg";

import { Header } from "components";
import { useAutoLogin } from "hooks";
import { HeaderLoginButton } from "./HeaderLoginButton";

export function HeaderUser() {
  const navigate = useNavigate();

  const { phonePermission, userInfo } = useAutoLogin();

  if (!phonePermission) return <HeaderLoginButton/>
  else {
    return (
      <Header 
        showBackIcon={false} 
        customRender={
          <Box flex flexDirection="row" alignItems="center" justifyContent="space-between">
            <Avatar
              size={30} online className="button mr-2"
              src={userInfo.avatar.startsWith("http") ? userInfo.avatar : UNKNOWN_AVATAR}
              onClick={() => navigate("/user")}
            />
            <Text.Title size="small" style={{ fontWeight: "bolder", textShadow: "1.5px 1.5px 1.5px black" }} className="button" onClick={() => navigate("/user")}> 
              {userInfo.name} 
            </Text.Title>
          </Box>
        }
      />
    )
  }
}