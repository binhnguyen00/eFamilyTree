import React from "react";
import { t } from "i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { logedInState, requestPhoneTriesState } from "states";

import { Button, Stack, Switch } from "zmp-ui";

export default function UISignInUser() {
  const retry = useSetRecoilState(requestPhoneTriesState);
  const login = useRecoilValue(logedInState);
  
  return (
    <Stack space="1rem">
      {!login && (
        <Button variant="secondary" onClick={() => retry(r => r + 1)}>
          {t("login")}
        </Button>
      )}
      {!login && (
        <Button variant="secondary">
          {t("register")}
        </Button>
      )}
      <Button variant="secondary">
        {t("register_clan")}
      </Button>
      <Switch label={t("vietnamese")} />
    </Stack>
  )
}