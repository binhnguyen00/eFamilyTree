import React from "react";
import { t } from "i18next";

import { Avatar, Box, Button, Grid, Stack, Text } from "zmp-ui";

import { Header } from "components";
import { UserSettingApi } from "api";
import { ServerResponse } from "server";

import UNKNOWN_AVATAR from "assets/img/unknown-person.jpeg";
import { useAppContext, useRouteNavigate } from "hooks";
import { CommonUtils } from "utils";

export function UIAccount() { 
  return (
    <div className="container">
      <Header title={t("account")} showBackIcon={false}/>

      <UIAccountContainer />
    </div>
  )
}

function UIAccountContainer() {
  const { zaloUserInfo, phoneNumber } = useAppContext();
  const { goTo, jumpTo } = useRouteNavigate();

  // Temporary methods
  const devs = [ 
    "+84942659016", 
    "+84936952262",
    "+84899096788"
  ] as string[];

  return (
    <Stack space="1rem">

      <Box flex flexDirection="column" alignItems="center">
        <Avatar
          size={120}
          src={zaloUserInfo.avatar ? zaloUserInfo.avatar : UNKNOWN_AVATAR}
          className="border-secondary"
        />
        <Text.Title className="text-capitalize text-shadow"> {zaloUserInfo.name} </Text.Title>
      </Box>

      <Button variant="secondary" onClick={() => goTo({ path: "register" }) }>
        {t("register")}
      </Button>

      <Button variant="secondary" onClick={() => goTo({ path: "register/clan" })}>
        {t("register_clan")}
      </Button>

      <Button variant="secondary" onClick={() => goTo({ path: "about" })}>
        {t("about")}
      </Button>

      {!phoneNumber || devs.includes(phoneNumber) ? (
        <Button variant="secondary" onClick={() => jumpTo({ path: "dev" })}>
          {t("developer")}
        </Button>
      ): null}

      <div className="p-3 rounded bg-secondary">
        <UISettings/>
      </div>

    </Stack>
  )
}

function UISettings() {
  const { userInfo, settings, updateSettings } = useAppContext();

  const changeLang = (langCode: "vi" | "en") => {
    const success = (result: ServerResponse) => {
      const settings = result.data;
      updateSettings(settings);
    }
    const target = { 
      theme: settings.theme, 
      language: langCode 
    }
    UserSettingApi.updateOrCreate(userInfo.id, userInfo.clanId, target, success);
  }

  const changeBackground = () => {

    const getImgSuccess = (base64: string) => {
      const success = (result: ServerResponse) => {
        const background = result.data;
        updateSettings({
          ...settings,
          background: {
            id: background["id"],
            path: background["path"]
          }
        })
      }
      UserSettingApi.updateBackground(userInfo.id, userInfo.clanId, base64, success);
    }

    const background = (document.getElementById('ftree-bg') as HTMLInputElement).files?.[0];
    CommonUtils.objToBase64(background, getImgSuccess);
  } 

  const resetBackground = () => {
    const success = (result: ServerResponse) => {
      const background = result.data;
      updateSettings({
        ...settings,
        background: {
          id: background["id"],
          path: background["path"]
        }
      })
    }
    UserSettingApi.resetBackground(userInfo.id, userInfo.clanId, success);
  }

  return (
    <Stack space="1rem">
      <Text.Title size="xLarge" className="text-primary text-capitalize center"> {t("settings")} </Text.Title>
      
      <Text.Title className="text-capitalize text-primary"> {t("language")} </Text.Title>
      <Stack space="1rem">
        <Grid columnCount={2} columnSpace="0.5rem">
          <Button variant="primary" size="medium" onClick={() => changeLang("vi")}>
            {t("vietnamese")}
          </Button>
          <Button variant="primary" size="medium" onClick={() => changeLang("en")}>
            {t("english")}
          </Button>
        </Grid>
      </Stack>

      <Text.Title className="text-capitalize text-primary"> {t("tree_background")} </Text.Title>
      <Stack space="1rem">
        <input
          type="file"
          id="ftree-bg" accept="image/*"
          style={{ 
            padding: "1em",
          }}
          className="border-primary rounded"
        />
        <Grid columnCount={2} columnSpace="0.5rem">
          <Button variant="primary" size="medium" onClick={changeBackground}>
            {t("update")}
          </Button>
          <Button variant="primary" size="medium" onClick={resetBackground}>
            {t("reset_background")}
          </Button>
        </Grid>
      </Stack>
    </Stack>
  )
}