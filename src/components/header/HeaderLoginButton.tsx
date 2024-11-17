import CommonIcons from "components/icon/common";
import React from "react";
import { useRecoilValue } from "recoil";
import { userState } from "states";

import { Avatar, Box, Text, useNavigate } from "zmp-ui";

import UNKNOWN_AVATAR from "assets/img/unknown-person.jpeg";

export default function HeaderLoginButton() {

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
      <Text size="small" onClick={() => navigate("/user")}> 
        {user.name} 
      </Text>
      <CommonIcons.ChevonRight size={"1rem"}/>
    </Box>
  )
}