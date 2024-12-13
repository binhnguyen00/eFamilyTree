import React from "react";
import { Avatar } from "zmp-ui";

import { Header } from "components";
import { useAutoLogin } from "hooks";

import UNKNOWN_AVATAR from "assets/img/unknown-person.jpeg";

export function HeaderUser() {
  const { userInfo, phonePermission } = useAutoLogin();

  if (!phonePermission) return (
    <Header
      showBackIcon={false}
      logo={<Avatar src={UNKNOWN_AVATAR} size={40}/>}
      title="Xin chào"
      subtitle="Chúc ngày mới tốt lành"
    />
  )
  else {
    return (
      <Header 
        showBackIcon={false} 
        logo={<Avatar src={userInfo.avatar} size={40}/>}
        title={`Xin chào, ${userInfo?.name}`}
        subtitle="Chúc ngày mới tốt lành"
      />
    )
  }
}