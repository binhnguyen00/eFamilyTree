import React from "react";
import { useRecoilValue } from "recoil";
import { phoneState, userState } from "states";

import UIHeader from "components/common/UIHeader";
import { Avatar, Box, Text, useNavigate } from "zmp-ui";
import { UIRequestLogin } from "./UIRequestLogin";

export function UIHeaderUser() {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const phone = useRecoilValue(phoneState);

  if (!phone) return <UIRequestLogin/>
  else {
    const UIUserInfo = () => {
      return (
        <Box flex flexDirection="row" alignItems="center" justifyContent="space-between">
          <Avatar
            size={30} online className="button mr-2"
            src={user.avatar.startsWith("http") ? user.avatar : undefined}
            onClick={() => navigate("/user")}
          />
          <Text size="large" className="button" onClick={() => navigate("/user")}> 
            {user.name} 
          </Text>
        </Box>
      )
    }
    return (
      <UIHeader showBackIcon={false} customRender={<UIUserInfo/>}/>
    )
  }
}