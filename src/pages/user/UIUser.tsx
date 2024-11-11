import React from "react";
import { Avatar, Box, Text, useNavigate } from "zmp-ui";
import { useRecoilValue } from "recoil";

import { userState } from "states";

function UIUser() { 
  let navigate = useNavigate();
  const userInfo = useRecoilValue(userState);

  const navigateToUIUser = () => {
    navigate("/user");
  }

  return (
    <Box flex flexDirection="column" alignItems="center">
      <Avatar
        size={60} online className="button"
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

export default UIUser; 