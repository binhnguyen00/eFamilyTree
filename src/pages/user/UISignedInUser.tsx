import React from "react";

import { Avatar, Box, Text } from "zmp-ui";

interface UISignedInUserProps {
  userInfo: any;
}
export default function UISignedInUser({ userInfo }: UISignedInUserProps) {

  return (
    <Box flex flexDirection="column" alignItems="center">
      <Avatar
        size={60} online className="button"
        src={userInfo.avatar.startsWith("http") ? userInfo.avatar : undefined}
      >
        {userInfo.avatar}
      </Avatar>
      <Text.Title> {userInfo.name} </Text.Title>
    </Box>
  )
}