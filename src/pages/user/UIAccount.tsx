import React from "react";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

import { Avatar, Box, Button, Grid, Stack, Text } from "zmp-ui";

import { AppContext, Header } from "components";

import UNKNOWN_AVATAR from "assets/img/unknown-person.jpeg";
import { FailResponse, ServerResponse } from "server";
import { UserSettingApi } from "api";

export function UIAccount() { 
  return (
    <div className="container">
      <Header title={t("account")} />

      <UIAccountContainer />
    </div>
  )
}

function UIAccountContainer() {
  const { userInfo, settings, updateSettings } = React.useContext(AppContext);
  const navigate = useNavigate();

  const changeLang = (langCode: "vi" | "en") => {
    const success = (result: ServerResponse) => {
      const settings = result.data;
      updateSettings(settings);
    }
    UserSettingApi.updateOrCreate("0942659016", {
      ...settings,
      language: langCode
    }, success);
  }

  return (
    <Stack space="1rem">

      <Box flex flexDirection="column" alignItems="center">
        <Avatar
          size={120}
          src={userInfo.avatar ? userInfo.avatar : UNKNOWN_AVATAR}
          className="border-secondary"
        />
        <Text.Title> {userInfo.name} </Text.Title>
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

      <Grid columnCount={2} columnSpace="0.5rem">
        <Button variant="secondary" onClick={() => changeLang("vi")}>
          {t("vietnamese")}
        </Button>
        <Button variant="secondary" onClick={() => changeLang("en")}>
          {t("english")}
        </Button>
      </Grid>

    </Stack>
  )
}


