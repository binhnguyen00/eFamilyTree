import React from "react";
import { t } from "i18next";
import { Avatar } from "zmp-ui";

import { Header } from "components";
import { useAppContext } from "hooks";

import UNKNOWN_AVATAR from "assets/img/unknown-person.jpeg";

export function HeaderUser() {
  const { logedIn, zaloUserInfo } = useAppContext();
  const [ userName, setUserName ] = React.useState("");

  React.useEffect(() => {
    if (zaloUserInfo) setUserName(zaloUserInfo.name);
  }, [ logedIn ]);

  return (
    <Header
      showBackIcon={false}
      logo={
        <Avatar 
          src={logedIn ? zaloUserInfo.avatar : UNKNOWN_AVATAR} 
          size={40} 
          className="border-secondary"
        />
      }
      title={logedIn ? `${t("hello")}, ${userName}` : t("hello")}
      subtitle={t("have_a_great_day")}
    />
  )
}