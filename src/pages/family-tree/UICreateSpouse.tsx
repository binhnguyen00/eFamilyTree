import React from "react";
import { t } from "i18next";
import { Button, Input, Sheet, Text, DatePicker } from "zmp-ui";

import { FamilyTreeApi } from "api";
import { DateTimeUtils } from "utils";
import { Member } from "types/common";
import { FailResponse, ServerResponse } from "types/server";
import { CommonIcon, Selection, Label } from "components";
import { useAppContext, useBeanObserver, useNotification } from "hooks";

interface UICreateSpouseProps {
  spouse: Member | null;
  visible: boolean;
  onClose: () => void;
  onReloadParent?: () => void;
} 

export function UICreateSpouse(props: UICreateSpouseProps) {
  if (props.spouse === null) return;

  const { onClose, spouse, visible, onReloadParent } = props;
  const { userInfo } = useAppContext();
  const { dangerToast, loadingToast } = useNotification();

  const isMalePartner = (): boolean => spouse.gender === "1";

  const onCreate = () => {
    if (!observer.getBean().name) {
      dangerToast(t("nhập đủ thông tin"))
      return;
    }
    loadingToast({
      content: <p> {t("đang tạo...")} </p>,
      operation: (successToastCB, dangerToastCB) => {
        FamilyTreeApi.createMember({
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
          fail: (error: FailResponse) => dangerToastCB(`${t("save")} ${t("fail")}`)
        })
      }
    })
  }

  const observer = useBeanObserver({
    gender: isMalePartner() ? "0" : "1",
    spouses: [{
      id: spouse.id,
      gender: spouse.gender,
      name: spouse.name,
    }],
  } as Member);

  return (
    <Sheet 
      visible={visible} onClose={onClose} swipeToClose
      height={"70vh"}
      title={t("Tạo Vợ/Chồng")}
    >
      <div className="scroll-v flex-v p-3">
        {/* form */}
        <Text.Title className="py-2"> {t("info")} </Text.Title>
        <Input 
          name="name" label={<Label text={`${t("họ tên")} *`}/>} 
          value={observer.getBean().name} onChange={observer.watch}
        />
        <Input
          name="phone" type="number" label={<Label text={t("điện thoại")}/>} 
          value={observer.getBean().phone} onChange={observer.watch}
        />
        <Selection
          options={[
            { value: "1", label: t("male") },
            { value: "0", label: t("female") }
          ]}
          observer={observer} field="gender" label={t("Giới Tính")}         
          defaultValue={
            observer.getBean().gender === "1" 
            ? { value: "1", label: t("male") }
            : { value: "0", label: t("female") }
          }
        />
        <DatePicker 
          mask maskClosable 
          label={t("Ngày Sinh")} title={t("Ngày Sinh")}
          onChange={(date: Date, calendarDate: any) => {
            observer.update("birthday", DateTimeUtils.formatToDate(date));
          }}
          value={
            observer.getBean().birthday 
            ? DateTimeUtils.toDate(observer.getBean().birthday)
            : new Date(new Date().setFullYear(new Date().getFullYear() - 20))
          }
        />
        <DatePicker 
          mask maskClosable 
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
        <Input 
          label={<Label text={observer.getBean().gender === "1" ? t("Chồng của") : t("Vợ của")}/>} 
          value={observer.getBean().spouses[0].name} disabled
        />
        {/* footer */}
        <div>
          <Text.Title className="py-2"> {t("Hành động")} </Text.Title>
          <Button size="small" prefixIcon={<CommonIcon.AddPerson/>} onClick={onCreate}> 
            {t("create")}
          </Button>
        </div> 
      </div>
    </Sheet>
  )
}