import React from "react";
import { t } from "i18next";

import { Grid, Stack, Text } from "zmp-ui";

import { UserSettingApi } from "api";
import { useAppContext, useNotification } from "hooks";
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

      <div className={`container ${className}`.trim()}>
        <Grid columnSpace="1rem" rowSpace="1rem" columnCount={2}>
          <UIThemeList/>
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
  const { userInfo, settings, updateSettings } = useAppContext();
  const { loadingToast } = useNotification();

  const onSaveTheme = (theme: Theme) => {
    loadingToast(
      <div>
        <p> {t("đang cập nhật")} </p>
        <p> {t("vui lòng chờ")} </p>
      </div>,
      (successToast, dangerToast) => {
        const success = (result: ServerResponse) => {
          const settings = result.data;
          updateSettings(settings)
          successToast(t("cập nhật thành công"))
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
    <Stack space="0.5rem" className={`center text-capitalize ${className}`.trim()} >
      <SizedBox 
        className="button"
        width={150} height={100} border
        onClick={() => onSaveTheme(theme)}
      >
        <img src={src} alt="theme"/>
      </SizedBox>
      <Text className="bold text-capitalize"> {renderTitle()} </Text>
    </Stack>
  )
}