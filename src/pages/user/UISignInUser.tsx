import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { phoneState, requestPhoneTriesState, userState } from "states";

import { Button, Stack } from "zmp-ui";

export default function UISignInUser() {

  const retry = useSetRecoilState(requestPhoneTriesState);

  return (
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
    </Stack>
  )
}