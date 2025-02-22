import React from "react";
import { t } from "i18next";
import { Button, Input, Sheet, Text, DatePicker } from "zmp-ui";

import { DateTimeUtils, StyleUtils } from "utils";
import { FamilyTreeApi } from "api";
import { CommonIcon, Selection, Label } from "components";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { FailResponse, ServerResponse } from "types/server";

import { Member } from "./UIFamilyTreeDetails";

interface UICreateRootProps {
  visible: boolean;
  onClose: () => void;
  onReloadParent?: () => void;
}
export function UICreateRoot(props: UICreateRootProps) {
  const { visible, onClose, onReloadParent } = props;

  const observer = useBeanObserver({} as Member)
  const { userInfo } = useAppContext();
  const { successToast, dangerToast } = useNotification();

  const onCreate = () => {
    if (!observer.getBean().phone || !observer.getBean().name) {
      dangerToast(t("nhập đủ thông tin"))
      return;
    }
    
    FamilyTreeApi.saveMember({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      member: observer.getBean(),
      success: (result: ServerResponse) => {
        if (result.status === "error") {
          dangerToast(`${t("save")} ${t("fail")}`)
        } else {
          successToast(`${t("save")} ${t("success")}`)
          if (onReloadParent) onReloadParent();
        }
        onClose();
      },
      fail: (error: FailResponse) => {
        dangerToast(`${t("save")} ${t("fail")}`)
      }
    })
  }

  return (
    <Sheet
      visible={visible} onClose={onClose}
      height={StyleUtils.calComponentRemainingHeight(0)}
      title={t("Tạo Thành Viên Đầu Tiên")}
      swipeToClose={false}
    >
      <div className="flex-v flex-grow-0 p-3">
        <div className="flex-v">
          <Text.Title className="py-2"> {t("info")} </Text.Title>
          <Input 
            name="name" className="mt-1" label={<Label text={`${t("họ tên")} *`}/>} 
            value={observer.getBean().name} onChange={observer.watch}
          />
          <Input
            name="phone" label={<Label text={`${t("điện thoại")} *`}/>} 
            value={observer.getBean().phone} onChange={observer.watch}
          />
          <Selection
            options={[
              { value: "1", label: t("male") },
              { value: "0", label: t("female") }
            ]}
            observer={observer} field="gender" label={t("giới tính")}
          />
          <DatePicker 
            mask maskClosable 
            label={t("Ngày Sinh")} title={t("Ngày Sinh")}
            onChange={(date: Date, calendarDate: any) => {
              observer.update("birthday", DateTimeUtils.formatToDate(date));
            }}
            value={new Date(new Date().setFullYear(new Date().getFullYear() - 20))}
          />
        </div>
        <div>
          <Text.Title className="py-2"> {t("Hành động")} </Text.Title>
          <Button size="small" prefixIcon={<CommonIcon.Save/>} onClick={onCreate}> 
            {t("save")}
          </Button>
        </div>
      </div>
    </Sheet>
  )
}