import React from "react";

import { ZmpSDK } from "utils";

export function useZaloSettings() {
  const [ settings, setSettings ] = React.useState({
    "scope.userInfo": false,
    "scope.userPhonenumber": false,
    "scope.userLocation": false,
    "scope.camera": false,
    "scope.micro": false
  });
  React.useEffect(() => {
    const success = (authSettings: any) => {
      setSettings(authSettings);
    }
    ZmpSDK.getSettings(success);
  }, [ ]);

  return settings;
}