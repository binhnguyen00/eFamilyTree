import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { phoneState, userState } from "states";
import { Avatar, Box, Text } from "zmp-ui";

import UNKNOWN_AVATAR from "assets/img/unknown-person.jpeg";

import { Header } from "components";
import { HeaderLoginButton } from "./HeaderLoginButton";

export function HeaderUser() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const phone = useRecoilValue(phoneState);

  if (!phone) return <HeaderLoginButton/>
  else {
    const UIUserInfo = () => {
      return (
        <Box flex flexDirection="row" alignItems="center" justifyContent="space-between">
          <Avatar
            size={30} online className="button mr-2"
            src={user.avatar.startsWith("http") ? user.avatar : UNKNOWN_AVATAR}
            onClick={() => navigate("/user")}
          />
          <Text.Title size="small" style={{ fontWeight: "bolder", textShadow: "1.5px 1.5px 1.5px black" }} className="button" onClick={() => navigate("/user")}> 
            {t(user.name)} 
          </Text.Title>
        </Box>
      )
    }
    return (
      <Header showBackIcon={false} customRender={<UIUserInfo/>}/>
    )
  }
}