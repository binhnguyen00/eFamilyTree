import React from "react";

import { ZmpSDK } from "utils";
import { ZaloSettings } from "types/app-context";

export function useZaloSettings() {
  const [ settings, setSettings ] = React.useState<ZaloSettings>({
    "scope.userInfo": false,
    "scope.userPhonenumber": false,
    "scope.userLocation": false,
    "scope.camera": false,
    "scope.micro": false
  });
  
  React.useEffect(() => {
    ZmpSDK.getAuthSettings({
      successCB: (authSettings: ZaloSettings) => setSettings(authSettings),
      failCB: () => setSettings({
        "scope.userInfo": false,
        "scope.userPhonenumber": false,
        "scope.userLocation": false,
        "scope.camera": false,
        "scope.micro": false
      })
    });
  }, [ ]);

  return settings;
}