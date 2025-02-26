import React from "react";
import { t } from "i18next";
import { Button, Input, Sheet, Text, DatePicker } from "zmp-ui";

import { FamilyTreeApi } from "api";
import { DateTimeUtils, StyleUtils } from "utils";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { BeanObserver, CommonIcon, Selection, Label } from "components";

import { FailResponse, ServerResponse } from "types/server";

import { Member } from "./UIFamilyTreeDetails";

interface UICreateSpouseProps {
  spouse: Member | null;
  visible: boolean;
  onClose: () => void;
  onReloadParent?: () => void;
} 

export function UICreateSpouse(props: UICreateSpouseProps) {
  const { onClose, spouse, visible, onReloadParent } = props;

  if (spouse === null) return;

  const { userInfo } = useAppContext();
  const { successToast, dangerToast } = useNotification();

  const onCreate = () => {
    if (!observer.getBean().phone || !observer.getBean().name) {
      dangerToast(t("nhập đủ thông tin"))
      return;
    }
    FamilyTreeApi.createMember({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      member: observer.getBean(),
      success: (result: ServerResponse) => {
        if (result.status === "error") {
          dangerToast?.(`${t("save")} ${t("fail")}`)
        } else {
          successToast?.(`${t("save")} ${t("success")}`)
          if (onReloadParent) onReloadParent();
        }
        onClose();
      },
      fail: (error: FailResponse) => dangerToast?.(`${t("save")} ${t("fail")}`)
    })
  }

  const observer = useBeanObserver({
    spouses: [{
      id: spouse.id,
      name: spouse.name,
      gender: spouse.gender,
    }],
  } as Member);

  return (
    <Sheet 
      visible={visible} onClose={onClose} swipeToClose
      height={StyleUtils.calComponentRemainingHeight(0)}
      title={t("Tạo Vợ/Chồng")}
    >
      <Form observer={observer} onCreate={onCreate}/>
    </Sheet>
  )
}

function Form({ observer, onCreate }: { 
  observer: BeanObserver<Member>; 
  onCreate: () => void;
}) {
  return (
    <div className="scroll-v flex-v p-3">
      <div>
        <Text.Title className="py-2"> {t("info")} </Text.Title>
        <Input 
          name="name" label={<Label text={`${t("họ tên")} *`}/>} 
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
          observer={observer} field="gender" label={t("Giới Tính")}         
          defaultValue={
            observer.getBean().gender === "1" 
            ? { value: "0", label: t("female") }
            : { value: "1", label: t("male") }
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
            : undefined
          }
        />
        <Input 
          label={<Label text={observer.getBean().gender === "1" ? t("Chồng của") : t("Vợ của")}/>} 
          value={observer.getBean().spouses[0].name} disabled
        />
      </div>
      <div>
        <Text.Title className="py-2"> {t("Hành động")} </Text.Title>
        <Button size="small" prefixIcon={<CommonIcon.AddPerson/>} onClick={onCreate}> 
          {t("create")}
        </Button>
      </div> 
    </div>
  )
}