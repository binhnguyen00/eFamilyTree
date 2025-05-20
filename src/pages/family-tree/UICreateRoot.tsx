import React from "react";
import { t } from "i18next";
import { Button, Input, Sheet, Text, DatePicker } from "zmp-ui";

import { FamilyTreeApi } from "api";
import { DateTimeUtils } from "utils";
import { CommonIcon, Selection, Label } from "components";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { PageContextProps, TreeMember, FailResponse, ServerResponse } from "types";

interface UICreateRootProps extends PageContextProps {
  visible: boolean;
  onClose: () => void;
  onReloadParent?: () => void;
}
export function UICreateRoot(props: UICreateRootProps) {
  const { visible, onClose, onReloadParent, permissions } = props;

  const { userInfo } = useAppContext();
  const { dangerToast, loadingToast } = useNotification();

  const observer = useBeanObserver({
    gender: "1",
  } as TreeMember)

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
      title={t("Tạo Thành Viên Đầu Tiên")}
      visible={visible} onClose={onClose} height={"70vh"}
      mask maskClosable={false} swipeToClose={false} handler={false}
    >
      <div className="flex-v flex-grow-0 p-3">
        {/* form */}
        <Text.Title> {t("info")} </Text.Title>
        <Input 
          name="name" label={<Label text={`${t("họ tên")} *`}/>} 
          value={observer.getBean().name} onChange={observer.watch} disabled={!permissions.canWrite}
        />
        <Input
          name="phone" type="number" label={<Label text={t("điện thoại")}/>} 
          value={observer.getBean().phone} onChange={observer.watch} disabled={!permissions.canWrite}
        />
        <Selection
          options={[ { value: "1", label: t("male") } ]}
          defaultValue={{ value: "1", label: t("male") }}
          observer={observer} field="gender" label={t("giới tính")} isDisabled={!permissions.canWrite}
        />
        <DatePicker 
          mask maskClosable disabled={!permissions.canWrite}
          label={t("Ngày Sinh")} title={t("Ngày Sinh")}
          onChange={(date: Date, calendarDate: any) => {
            observer.update("birthday", DateTimeUtils.formatToDate(date));
          }}
          value={new Date(new Date().setFullYear(new Date().getFullYear() - 20))}
        />
        <DatePicker 
          mask maskClosable disabled={!permissions.canWrite}
          label={t("Ngày Mất (Âm lịch)")} title={t("Ngày Mất (Âm lịch)")}
          onChange={(date: Date, calendarDate: any) => {
            observer.update("lunarDeathDay", DateTimeUtils.formatToDate(date));
          }}
          value={
            observer.getBean().lunarDeathDay 
            ? DateTimeUtils.toDate(observer.getBean().lunarDeathDay)
            : new Date(new Date().setFullYear(new Date().getFullYear() - 20))
          }
        />
        {/* footer */}
        <div>
          <Text.Title className="py-2"> {t("Hành động")} </Text.Title>
          <Button size="small" prefixIcon={<CommonIcon.Save/>} onClick={onCreate} disabled={!permissions.canWrite}> 
            {t("save")}
          </Button>
        </div>
      </div>
    </Sheet>
  )
}