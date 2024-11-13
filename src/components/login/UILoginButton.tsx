import React from "react";
import { t } from "i18next";
import { useSetRecoilState } from "recoil";
import { requestPhoneTriesState } from "states";

import { Button } from "zmp-ui";

interface UILoginButtonProps {
  size?: "small" | "medium" | "large";
  onClickCallBack?: () => void;
}
export default function UILoginButton(props: UILoginButtonProps) {
  let { onClickCallBack, size } = props;
  if (!size) size = "small";
  if (!onClickCallBack) onClickCallBack = () => {};

  const retry = useSetRecoilState(requestPhoneTriesState);
  
  return (
    <Button size={size} onClick={() => {
      retry(r => r + 1);
      onClickCallBack();
    }}>
      {t("login")}
    </Button>
  )
}