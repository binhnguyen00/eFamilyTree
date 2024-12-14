import React from "react";
import { Avatar } from "zmp-ui";

import { AutoLoginContext, Header } from "components";

import UNKNOWN_AVATAR from "assets/img/unknown-person.jpeg";

export function HeaderUser() {
  const { logedIn, user, phone } = React.useContext(AutoLoginContext);

  if (!logedIn) return (
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
        logo={<Avatar src={user.avatar} size={40}/>}
        title={`Xin chào, ${user.name}`}
        subtitle="Chúc ngày mới tốt lành"
      />
    )
  }
}