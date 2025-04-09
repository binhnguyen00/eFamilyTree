import React from "react";
import { t } from "i18next";
import { Button, Input, Sheet, Text, DatePicker } from "zmp-ui";

import { DateTimeUtils, StyleUtils } from "utils";
import { FamilyTreeApi } from "api";
import { CommonIcon, Selection, Label } from "components";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { FailResponse, ServerResponse } from "types/server";

import { Member } from "./UIFamilyTreeDetails";
import { content } from "html2canvas/dist/types/css/property-descriptors/content";

interface UICreateRootProps {
  visible: boolean;
  onClose: () => void;
  onReloadParent?: () => void;
}
export function UICreateRoot(props: UICreateRootProps) {
  const { visible, onClose, onReloadParent } = props;

  const { userInfo } = useAppContext();
  const { dangerToast, loadingToast } = useNotification();

  const observer = useBeanObserver({
    gender: "1",
  } as Member)

  const onCreate = () => {
    if (!observer.getBean().name) {
      dangerToast(t("nhập đủ thông tin"))
      return;
    }
    loadingToast({
      content: <p> {t("đang tạo...")} </p>,
      operation: (successToastCB, dangerToastCB) => {
        FamilyTreeApi.saveMember({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          member: observer.getBean(),
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToastCB(`${t("save")} ${t("fail")}`)
            } else {
              successToastCB(`${t("save")} ${t("success")}`)
              if (onReloadParent) onReloadParent();
            }
            onClose();
          },
          fail: (error: FailResponse) => {
            dangerToastCB(`${t("save")} ${t("fail")}`)
          }
        })
      }
    })
  }

  return (
    <Sheet
      visible={visible} onClose={onClose}
      height={StyleUtils.calComponentRemainingHeight(0)}
      title={t("Tạo Thành Viên Đầu Tiên")}
      mask maskClosable={false}
      swipeToClose={false} 
      handler={false}
    >
      <div className="flex-v flex-grow-0 p-3">
        {/* form */}
        <Text.Title> {t("info")} </Text.Title>
        <Input 
          name="name" label={<Label text={`${t("họ tên")} *`}/>} 
          value={observer.getBean().name} onChange={observer.watch}
        />
        <Input
          name="phone" type="number" label={<Label text={t("điện thoại")}/>} 
          value={observer.getBean().phone} onChange={observer.watch}
        />
        <Selection
          options={[ { value: "1", label: t("male") } ]}
          defaultValue={{ value: "1", label: t("male") }}
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
        {/* footer */}
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