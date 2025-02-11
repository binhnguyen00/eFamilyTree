import React from "react";
import { t } from "i18next";
import { Avatar, Button, Grid, Text } from "zmp-ui";

import { CommonIcon, Header } from "components";
import { UserSettingApi } from "api";
import { CommonUtils } from "utils";
import { useAppContext, useNotification, useRouteNavigate } from "hooks";

import { ServerResponse } from "types/server";

import UNKNOWN_AVATAR from "assets/img/unknown-person.jpeg";
import { UIThemeList } from "pages/theme/UITheme";

export function UIAccount() { 
  return (
    <>
      <Header title={t("account")} showBackIcon={false}/>

      <UIAccountContainer />
    </>
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
    <div className="container flex-v text-primary">

      <div className="center my-3">
        <Avatar
          size={120}
          src={zaloUserInfo.avatar ? zaloUserInfo.avatar : UNKNOWN_AVATAR}
          className="border-secondary"
        />
        <Text.Title className="text-capitalize"> {zaloUserInfo.name} </Text.Title>
      </div>

      <Button variant="secondary" onClick={() => goTo({ path: "register" }) }>
        {t("Đăng Ký Tài Khoản")}
      </Button>

      <Button variant="secondary" onClick={() => goTo({ path: "register/clan" })}>
        {t("register_clan")}
      </Button>

      {/* <Button variant="secondary" onClick={() => goTo({ path: "about" })}>
        {t("about")}
      </Button> */}

      {devs.includes(phoneNumber) ? (
        <Button variant="secondary" onClick={() => jumpTo({ path: "dev" })}>
          {t("developer")}
        </Button>
      ): null}

      <div className="p-3 rounded bg-secondary">
        <UISettings/>
      </div>

    </div>
  )
}

function UISettings() {
  const { goTo } = useRouteNavigate();
  const { userInfo, settings, updateSettings } = useAppContext();
  const { loadingToast, successToast, dangerToast } = useNotification();

  const changeLang = (langCode: "vi" | "en") => {
    const success = (result: ServerResponse) => {
      if (result.status === "success") {
        const settings = result.data;        
        updateSettings(settings);
        successToast(t("update_success"));
      } else {
        dangerToast(t("update_fail"))
      }
    }
    const target = { 
      theme: settings.theme, 
      language: langCode 
    }
    UserSettingApi.updateOrCreate(userInfo.id, userInfo.clanId, target, success);
  }

  const changeBackground = () => {
    loadingToast(
      t("updating_background"),
      (onSuccess, onFail) => {
        const getImgSuccess = (base64: string) => {
          const success = (result: ServerResponse) => {
            const background = result.data;
            if (background["id"] !== 0) {
              onSuccess(t("update_success"));
            } else {
              onFail(t("update_failed"));
            }
            updateSettings({
              ...settings,
              background: {
                id: background["id"],
                path: background["path"]
              }
            })
          }
          UserSettingApi.updateBackground(userInfo.id, userInfo.clanId, base64, success, () => onFail(t("update_fail")));
        }
        const background = (document.getElementById('ftree-bg') as HTMLInputElement).files?.[0];
        if (!background) {
          onFail(t("file_require"));
        }
        CommonUtils.objToBase64(
          background, 
          getImgSuccess, 
          () => onFail(t("update_fail"))
        );
      }
    )
    
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
      successToast(t("update_success"));
    }
    UserSettingApi.resetBackground(userInfo.id, userInfo.clanId, success, () => successToast(t("update_success")));
  }

  return (
    <div className="flex-v">
      <Text.Title size="xLarge" className="text-primary text-capitalize center"> {t("settings")} </Text.Title>
      
      {/* language */}
      <Text.Title className="text-capitalize text-primary"> {t("language")} </Text.Title>
      <div className="flex-v">
        <Grid columnCount={2} columnSpace="0.5rem">
          <Button variant="primary" size="medium" onClick={() => changeLang("vi")}>
            {t("vietnamese")}
          </Button>
          <Button variant="primary" size="medium" onClick={() => changeLang("en")}>
            {t("english")}
          </Button>
        </Grid>
      </div>

      {/* tree background */}
      <Text.Title className="text-capitalize text-primary"> {t("tree_background")} </Text.Title>
      <div className="flex-v">
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
      </div>

      {/* theme */}
      <div className="flex-h justify-between">
        <Text.Title className="text-primary text-capitalize"> {t("theme")} </Text.Title>
        <Button 
          size="small" variant="secondary" 
          suffixIcon={<CommonIcon.ChevonRight size={"1rem"}/>} 
          onClick={() => goTo({ path: "theme" })}
        >
          {t("more")}
        </Button>
      </div>
      <div className="scroll-h">
        <UIThemeList/>
      </div>
    </div>
  )
}