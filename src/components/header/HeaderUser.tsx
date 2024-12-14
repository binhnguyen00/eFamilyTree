import React from "react";
import { Avatar } from "zmp-ui";

import { AutoLoginContext, Header } from "components";

import UNKNOWN_AVATAR from "assets/img/unknown-person.jpeg";

export function HeaderUser() {
  const { logedIn, user, phone } = React.useContext(AutoLoginContext);
  const [ userName, setUserName ] = React.useState("");

  React.useEffect(() => {
    if (user) setUserName(user.name);
  }, [ logedIn ]);

  return (
    <Header
      showBackIcon={false}
      logo={
        <Avatar 
          src={logedIn ? user.avatar : UNKNOWN_AVATAR} 
          size={40} 
          className="border-secondary"
        />
      }
      title={logedIn ? `Xin chào, ${userName}` : "Xin chào"}
      subtitle="Chúc ngày mới tốt lành"
    />
  )
}