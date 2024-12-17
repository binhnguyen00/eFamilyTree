import React from "react";
import { Avatar } from "zmp-ui";

import { AppContext, Header } from "components";

import UNKNOWN_AVATAR from "assets/img/unknown-person.jpeg";

export function HeaderUser() {
  const { logedIn, userInfo } = React.useContext(AppContext);
  const [ userName, setUserName ] = React.useState("");

  React.useEffect(() => {
    if (userInfo) setUserName(userInfo.name);
  }, [ logedIn ]);

  return (
    <Header
      showBackIcon={false}
      logo={
        <Avatar 
          src={logedIn ? userInfo.avatar : UNKNOWN_AVATAR} 
          size={40} 
          className="border-secondary"
        />
      }
      title={logedIn ? `Xin chào, ${userName}` : "Xin chào"}
      subtitle="Chúc ngày mới tốt lành"
    />
  )
}