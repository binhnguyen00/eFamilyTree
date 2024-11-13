import CommonIcons from "components/icon/common";
import React from "react";
import { useRecoilValue } from "recoil";
import { userState } from "states";

import { Avatar, Box, Text, useNavigate } from "zmp-ui";

export default function UIRequestLoginButton() {

  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  
  return (
    <Box flex flexDirection="row" alignItems="center" justifyContent="space-between" className="button">
      <Avatar
        size={30} online className="button mr-2"
        src={user.avatar.startsWith("http") ? user.avatar : undefined}
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