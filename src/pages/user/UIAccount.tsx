import React from "react";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

import { Avatar, Box, Button, Stack, Text } from "zmp-ui";

import { AppContext, Header } from "components";

import UNKNOWN_AVATAR from "assets/img/unknown-person.jpeg";

export function UIAccount() { 
  const { logedIn, userInfo } = React.useContext(AppContext);
  return (
    <div className="container">
      <Header title={t("account")} />

      <UIAccountContainer logedIn={logedIn} user={userInfo}/>
    </div>
  )
}

interface AccountProps {
  logedIn: boolean,
  user: any
}
function UIAccountContainer(props: AccountProps) {
  const navigate = useNavigate();
  const { user } = props;

  return (
    <Stack space="1rem">

      <Box flex flexDirection="column" alignItems="center">
        <Avatar
          size={120}
          src={user.avatar ? user.avatar : UNKNOWN_AVATAR}
          className="border-secondary"
        />
        <Text.Title> {user.name} </Text.Title>
      </Box>

      <Button variant="secondary" onClick={() => navigate("/register") }>
        {t("register")}
      </Button>

      <Button variant="secondary" onClick={() => navigate("/register-clan")}>
        {t("register_clan")}
      </Button>

      <Button variant="secondary" onClick={() => navigate("/about")}>
        {t("about")}
      </Button>

    </Stack>
  )
}


