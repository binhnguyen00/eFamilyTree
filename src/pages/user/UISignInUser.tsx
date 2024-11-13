import UIHeader from "components/common/UIHeader";
import { t } from "i18next";
import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { phoneState, requestPhoneTriesState, userState } from "states";

import { Button, Stack } from "zmp-ui";

export default function UISignInUser() {

  const retry = useSetRecoilState(requestPhoneTriesState);

  return (
    <div>
      <UIHeader title={t("account")}/>

      <Stack space="1rem">
        <Button onClick={() => retry(r => r + 1)}>
          đăng nhập
        </Button>
        <Button>
          đăng kí tài khoản
        </Button>
        <Button>
          đăng kí dòng họ
        </Button>
        <Button variant="tertiary" style={{ color: "red" }} onClick={() => retry(0)}>
          đăng xuất
        </Button>
      </Stack>
    </div>
  )
}