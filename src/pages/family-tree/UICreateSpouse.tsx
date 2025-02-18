import React from "react";
import { t } from "i18next";
import { Button, Input, Sheet, Text, DatePicker } from "zmp-ui";

import { FamilyTreeApi } from "api";
import { DateTimeUtils, StyleUtils } from "utils";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { BeanObserver, CommonIcon, Selection } from "components";

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
    console.log(observer.getBean());

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

function Label({  text }: { text: string }) {
  return <span className="text-primary"> {t(text)} </span>
}

function Form({ observer, onCreate }: { 
  observer: BeanObserver<Member>; 
  onCreate: () => void;
}) {
  return (
    <div className="scroll-v p-3">
      <div>
        <Text.Title className="py-2"> {t("info")} </Text.Title>
        <Input 
          size="small" name="name" label={<Label text={t("Họ Tên")}/>} 
          value={observer.getBean().name} onChange={observer.watch}
        />
        <Input
          size="small" name="phone" label={<Label text={t("Điện Thoại")}/>} 
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
        />
        <Input 
          size="small" name="name" 
          label={<Label text={observer.getBean().gender === "1" ? t("Vợ của") : t("Chồng của")}/>} 
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