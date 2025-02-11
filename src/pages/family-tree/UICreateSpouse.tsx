import React from "react";
import { t } from "i18next";
import { Button, Input, Sheet, Text } from "zmp-ui";

import { FamilyTreeApi } from "api";
import { StyleUtils } from "utils";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { BeanObserver, CommonIcon, Selection, DatePicker } from "components";

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
    <div className="px-2">
      <>
        <Text.Title className="py-2"> {t("info")} </Text.Title>
        <div className="flex-h justify-between">
          <Selection
            options={[
              { value: "1", label: t("male") },
              { value: "0", label: t("female") }
            ]}
            observer={observer} field="gender" label={t("Giới Tính")}         
          />
          <Input
            size="small" name="phone" label={<Label text={t("Điện Thoại")}/>} 
            value={observer.getBean().phone} onChange={observer.watch}
          />
        </div>
        <div className="flex-v">
          <Input 
            size="small" name="name" label={<Label text={t("Họ Tên")}/>} 
            value={observer.getBean().name} onChange={observer.watch}
          />
          <DatePicker 
            field="birthday"
            observer={observer} label={t("Ngày sinh")}
          />
          <Input 
            size="small" name="name" label={<Label text={t("Vợ/Chồng của")}/>} 
            value={observer.getBean().spouses[0].name} disabled
          />
        </div>
      </>
      <>
        <Text.Title size="small" className="py-2"> {t("Hành động")} </Text.Title>
        <Button size="small" prefixIcon={<CommonIcon.AddPerson/>} onClick={onCreate}> 
          {t("create")}
        </Button>
      </> 
    </div>
  )
}