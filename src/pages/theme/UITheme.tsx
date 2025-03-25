import React from "react";
import { t } from "i18next";

import { Grid, Text } from "zmp-ui";

import { UserSettingApi } from "api";
import { useAccountContext, useAppContext, useNotification, useRequestPhoneContext, useSettings } from "hooks";
import { Header, SizedBox } from "components";

import { Theme } from "types/user-settings";
import { ServerResponse } from "types/server";

import themeRed from "assets/img/theme/theme-red.jpeg";
import themeGreen from "assets/img/theme/theme-green.jpeg";
import themeBlue from "assets/img/theme/theme-blue.jpeg";

interface UIThemeProps {
  className?: string;
}

export function UITheme(props: UIThemeProps) {
  const { className } = props;
  return (
    <>
      <Header title={t("theme")}/>

      <div className={`container bg-white max-h ${className}`.trim()}>
        <Grid columnSpace="0.5rem" rowSpace="1rem" columnCount={2}>
          <UIThemeList className="text-primary"/>
        </Grid>
      </div>
    </>
  )
}

export function UIThemeList(props: UIThemeProps) {
  const { className } = props;
  return (
    <>
      <ThemeCard theme={Theme.DEFAULT} src={themeRed} className={className}/>
      <ThemeCard theme={Theme.BLUE} src={themeBlue} className={className}/>
      <ThemeCard theme={Theme.EMERALD} src={themeGreen} className={className}/>
    </>
  )
}

interface ThemeCardProps extends UIThemeProps {
  theme: Theme;
  src: string;
}
function ThemeCard(props: ThemeCardProps) {
  const { theme, src, className } = props;
  const { userInfo, settings, updateTheme } = useAppContext();
  const { loadingToast } = useNotification();
  const { 
    needRegisterClan, registerClan, 
    needRegisterAccount, registerAccount } = useAccountContext();
  const { needPhone, requestPhone } = useRequestPhoneContext();

  const onSaveTheme = (theme: Theme) => {
    if (needPhone) { requestPhone(); return; }
    else if (needRegisterClan) { registerClan(); return; } 
    else if (needRegisterAccount) { registerAccount(); return; }
    else loadingToast(
      <p> {t("đang cập nhật...")} </p>,
      (successToast, dangerToast, dismissToast) => {
        const success = (result: ServerResponse) => {
          const settings = result.data;
          updateTheme(settings.theme);
          dismissToast();
        }
        const fail = () => {
          dangerToast(t("cập nhật thất bại"))
          return;
        }
        const target = {
          ...settings,
          theme: theme
        }
        UserSettingApi.updateOrCreate(userInfo.id, userInfo.clanId, target, success, fail);
      }
    )
  }

  const renderTitle = () => {
    switch (theme) {
      case Theme.DEFAULT:
        return t("theme_red");
      case Theme.BLUE:
        return t("theme_blue");
      case Theme.EMERALD:
        return t("ngọc lục bảo");
      default:
        return t("");
    }
  }

  return (
    <div className={`flex-v center text-capitalize ${className}`.trim()} >
      <SizedBox 
        className="button border-secondary rounded"
        width={160} height={120}
        onClick={() => onSaveTheme(theme)}
      >
        <img src={src} alt="theme"/>
      </SizedBox>
      <Text className="bold text-capitalize"> {renderTitle()} </Text>
    </div>
  )
}