import React from "react";
import { t } from "i18next";
import { useSetRecoilState } from "recoil";
import { requestPhoneTriesState } from "states";

import { Button } from "zmp-ui";

export function UIRequestLogin() {
  const retry = useSetRecoilState(requestPhoneTriesState);
  return (
    <Button size="small" onClick={() => retry(r => r + 1)}>
      {t("login")}
    </Button>
  )
}