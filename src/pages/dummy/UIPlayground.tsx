import React from "react";

import { t } from "i18next";
import { Button, Text, Stack, Grid } from "zmp-ui";

import { BaseServer, UserSettingApi } from "api";
import { Header, Loading, SizedBox } from "components";
import { FailResponse, ServerResponse } from "server";
import { useAppContext } from "hooks";

import themeRed from "assets/img/theme/theme-red.jpeg";
import themeBlue from "assets/img/theme/theme-blue.jpeg";

export function UIPlayground() {

  return (
    <Stack space="1rem" className="container">
      <Header title={t("playground")}/>

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

      <UIUserSetting/>

      <UIUploadImageFile/>

      <UITheme/>

      <Loading/>

    </Stack>
  )
}

function UIUserSetting() {
  return (
    <Stack space="1rem">
      <Text.Title size="large" className="text-capitalize"> {t("setting")} </Text.Title>
      <Grid columnCount={3} columnSpace="0.5rem" rowSpace="0.5rem">

        <Button variant="secondary" onClick={() => {
          const success = (result: ServerResponse) => { console.log(result); } 
          const fail = (error: FailResponse) => { console.error(error); }
          UserSettingApi.getOrDefault("0942659016", success, fail);
        }}>
          {"Get Settings"}
        </Button>

        <Button variant="secondary" onClick={() => {
          const success = (result: ServerResponse) => { console.log(result); } 
          const fail = (error: FailResponse) => { console.error(error); }
          UserSettingApi.updateOrCreate("0942659016", {
            theme: "blue",
            language: "vi",
          }, success, fail);
        }}>
          {"Blue Theme"}
        </Button>

      </Grid>
    </Stack>
  )
}

function UITheme() {
  const { settings, updateSettings } = useAppContext();

  return (
    <Stack space="1rem">
      <Text.Title size="large" className="text-capitalize"> {t("theme")} </Text.Title>
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
    </Stack>
  )
}

function UIUploadImageFile() {

  const getImage = () => {
    const fileInput = (document.getElementById('ftree-bg') as HTMLInputElement).files?.[0];
    return fileInput || null;
  }

  const upload = (event: any) => {
    const image = getImage();
    console.log(image);
    if (!image) return;

    const success = (result: ServerResponse) => {
      console.log(result.data);
    }
    const fail = (error: FailResponse) => {
      console.error(error);
    }
    UserSettingApi.updateBackground("0942659016", image, success, fail);
  }

  const get = () => {
    const success = (result: ServerResponse) => {
      console.log(result.data);
    }
    const fail = (error: FailResponse) => {
      console.error(error);
    }
    UserSettingApi.getBackground("0942659016", success, fail);
  }

  return (
    <Stack space="1rem">
      <Text.Title size="large" className="text-capitalize"> {t("Change Tree Background")} </Text.Title>

      <input
        type="file"
        id="ftree-bg" accept="image/*"
      />

      <Grid columnCount={2} columnSpace="0.5rem">
        <Button variant="secondary" onClick={upload}> 
          upload 
        </Button>
        <Button variant="secondary" onClick={get}> 
          get
        </Button>
      </Grid>
    </Stack>
  )
}