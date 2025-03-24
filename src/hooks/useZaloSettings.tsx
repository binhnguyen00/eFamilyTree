import React from "react";
import { t } from "i18next";

import { ZmpSDK } from "utils";
import { UIAbout } from "pages/about/UIAbout";
import { ZaloSettings } from "types/app-context";
import { useOverlayContext } from "components/provider/OverlayProvider";

export function useZaloSettings() {
  const { open } = useOverlayContext();

  const greetings = () => {
    open({
      title: t("Chào mừng đến với Gia Phả Lạc Hồng"),
      content: <UIAbout/>
    });
  }

  const [ settings, setSettings ] = React.useState<ZaloSettings>({
    "scope.userInfo": false,
    "scope.userPhonenumber": false,
    "scope.userLocation": false,
    "scope.camera": false,
    "scope.micro": false
  });
  
  React.useEffect(() => {
    ZmpSDK.getAuthSettings({
      successCB: (authSettings: ZaloSettings) => {
        setSettings(authSettings);
        if (!authSettings["scope.userPhonenumber"]) {
          greetings();
        }
      },
      failCB: () => {
        setSettings({
          "scope.userInfo": false,
          "scope.userPhonenumber": false,
          "scope.userLocation": false,
          "scope.camera": false,
          "scope.micro": false
        });
        greetings();
      }
    });
  }, [ ]);

  return settings;
}