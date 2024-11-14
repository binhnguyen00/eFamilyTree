import React from "react";
import { t } from "i18next";
import { useSetRecoilState } from "recoil";
import { requestPhoneTriesState } from "states";

import { Button, Stack } from "zmp-ui";

export default function UISignInUser() {
  const retry = useSetRecoilState(requestPhoneTriesState);
  return (
    <Stack space="1rem">
      <Button onClick={() => retry(r => r + 1)}>
        {t("login")}
      </Button>
      <Button>
        {t("register")}
      </Button>
      <Button>
        {t("register_clan")}
      </Button>
      <Button variant="tertiary" size="small" onClick={() => retry(0)}>
        {t("logout")}
      </Button>
    </Stack>
  )
}