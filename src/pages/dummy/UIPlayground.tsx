import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Text, Stack } from "zmp-ui";

import { BaseServer, UserSettingApi } from "api";
import { Header, Loading, SizedBox } from "components";
import { FailResponse, ServerResponse } from "server";
import { useAppContext } from "hooks";

import themeRed from "assets/img/theme/theme-red.jpeg";
import themeBlue from "assets/img/theme/theme-blue.jpeg";

export function UIPlayground() {
  const { t, i18n } = useTranslation();
  const { settings, updateSettings } = useAppContext();

  return (
    <Stack space="1rem" className="container">
      <Header title={t("playground")}/>

      <div className="scroll-h flex-h">
        <Stack space="0.5rem" className="center text-capitalize">
          <SizedBox 
            className="button"
            width={150} 
            height={100} 
            border
            onClick={() => {
              updateSettings({
                ...settings,
                theme: "default"
              })
            }}
          >
            <img src={themeRed} alt="theme red"/>
          </SizedBox>
          <Text> {t("theme_red")} </Text>
        </Stack>

        <Stack space="0.5rem" className="center text-capitalize">
          <SizedBox 
            className="button"
            width={150} 
            height={100} 
            border
            onClick={() => {
              updateSettings({
                ...settings,
                theme: "blue"
              })
            }}
          >
            <img src={themeBlue} alt="theme blue"/>
          </SizedBox>
          <Text> {t("theme_blue")} </Text>
        </Stack>
      </div>

      <Stack space="1rem">
        <Text.Title size="large"> {t("playground_translate")} </Text.Title>
        <Button variant="secondary" onClick={() => i18n.changeLanguage("vi")}>
          {t("vietnamese")}
        </Button>
        <Button variant="secondary" onClick={() => i18n.changeLanguage("en")}>
          {t("english")}
        </Button>
      </Stack>
      
      <Stack space="1rem">
        <Text.Title size="large"> {"Mock CORS"} </Text.Title>
        <Button variant="secondary" onClick={() => {
          const success = (result: ServerResponse) => {
            console.log(result);
          } 
          const fail = (error: FailResponse) => {
            console.error(error);
          }
          BaseServer.mockHTTP(success, fail);
        }}>
          {"HTTP"}
        </Button>
      </Stack>

      <Stack space="1rem">
        <Text.Title size="large"> {"Test Settings API"} </Text.Title>
        <Button variant="secondary" onClick={() => {
          const success = (result: ServerResponse) => {
            console.log(result);
          } 
          const fail = (error: FailResponse) => {
            console.error(error);
          }
          UserSettingApi.getOrDefault("0942659016", success, fail);
        }}>
          {"Get Settings"}
        </Button>
      </Stack>
      
      <Loading/>

    </Stack>
  )
}