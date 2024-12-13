import React from "react";
import { Avatar } from "zmp-ui";

import { useRecoilValue } from "recoil";
import { hasPhonePermission, userState } from "states";

import { Header } from "components";

import UNKNOWN_AVATAR from "assets/img/unknown-person.jpeg";

export function HeaderUser() {
  const phonePermission = useRecoilValue(hasPhonePermission);

  if (!phonePermission) return (
    <Header
      showBackIcon={false}
      logo={<Avatar src={UNKNOWN_AVATAR} size={40}/>}
      title="Xin chào"
      subtitle="Chúc ngày mới tốt lành"
    />
  )
  else {
    const userInfo = useRecoilValue(userState);
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