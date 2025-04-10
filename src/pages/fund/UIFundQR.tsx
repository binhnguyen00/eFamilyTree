import React from "react";
import { t } from "i18next";
import { Button, Input, Sheet } from "zmp-ui";

import { CommonIcon, ScrollableDiv } from "components";
import { useBeanObserver } from "hooks";

export interface FundQR {
  accountNumber: string;
  accountOwner: string;
  bankName: string;
  imageQR: string;
}

interface UIFundQRProps {
  visible: boolean;
  title: string;
  fundQR: FundQR;
  onClose: () => void;
}
export function UIFundQR(props: UIFundQRProps) {
  const { visible, title, fundQR, onClose } = props;
  const observer = useBeanObserver(fundQR);

  const onSave = () => {
    // TODO: Save qr code;
  }

  return (
    <Sheet title={title} visible={visible} onClose={onClose} mask maskClosable>
      <ScrollableDiv className="flex-v p-3" direction="vertical" height={"80vh"}>
        <div className="flex-v flex-grow-0">
          <div>
            {observer.getBean().imageQR}
          </div>
          <Input label={t("số tài khoản")} value={observer.getBean().accountNumber} disabled/>
          <Input label={t("chủ tài khoản")} value={observer.getBean().accountOwner} disabled/>
          <Input label={t("ngân hàng")} value={observer.getBean().bankName} disabled/>
        </div>
        <div className="center">
          <Button size="small" prefixIcon={<CommonIcon.Save/>} onClick={onSave}>
            {t("save")}
          </Button>
        </div>
        <br />
      </ScrollableDiv>
    </Sheet>
  )
}