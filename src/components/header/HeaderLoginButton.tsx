import React from "react";
import { useRecoilValue } from "recoil";
import { userState } from "states";
import { CommonIcon } from "components/icon/common";

import { Avatar, Box, Text, useNavigate } from "zmp-ui";

import UNKNOWN_AVATAR from "assets/img/unknown-person.jpeg";

export function HeaderLoginButton() {

  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  
  return (
    <Box flex flexDirection="row" alignItems="center" justifyContent="space-between" className="button">
      <Avatar
        size={30} className="button mr-2"
        src={UNKNOWN_AVATAR}
        onClick={() => {
          navigate("/user")
        }}
      />
      <Text.Title size="small" style={{ fontWeight: "bolder", textShadow: "1.5px 1.5px 1.5px black" }} onClick={() => navigate("/user")}> 
        {user.name} 
      </Text.Title>
      <CommonIcon.ChevonRight size={"1rem"}/>
    </Box>
  )
}