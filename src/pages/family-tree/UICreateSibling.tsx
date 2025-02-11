import React from "react";
import { t } from "i18next";
import { Button, Input, Sheet, Text } from "zmp-ui";

import { StyleUtils } from "utils";
import { FamilyTreeApi } from "api";
import { CommonIcon, DatePicker, Selection } from "components";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { FailResponse, ServerResponse } from "types/server";

import { Member } from "./UIFamilyTreeDetails";

interface UICreateSiblingProps {
  sibling: Member | null;
  visible: boolean;
  onClose: () => void;
  onReloadParent?: () => void;
}

export function UICreateSibling(props: UICreateSiblingProps) {
  const { sibling, visible, onClose, onReloadParent } = props;
  const { userInfo } = useAppContext();
  const { successToast, dangerToast } = useNotification();

  if (!sibling) return;
  if (visible && (!sibling.fatherId)) {
    dangerToast(t("Thành viên cần có Bố để tạo Anh/Chị/Em"));
    return;
  }

  const observer = useBeanObserver({
    gender: "1",
    mother: sibling.mother,
    motherId: sibling.motherId,
    father: sibling.father,
    fatherId: sibling.fatherId,
  } as Member);

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
          if (onReloadParent) onReloadParent()
        }
        onClose();
      },
      fail: (error: FailResponse) => dangerToast?.(`${t("save")} ${t("fail")}`)
    })
  }

  return (
    <Sheet
      visible={visible} onClose={onClose}
      title={t("Tạo Anh/Chị/Em")} height={StyleUtils.calComponentRemainingHeight(0)}
    >
      <div className="scroll-v p-3">
        <Text.Title className="py-2"> {t("info")} </Text.Title>
        <Input 
          size="small" name="name" label={<Label text="Họ Tên"/>} 
          value={observer.getBean().name} onChange={observer.watch}
        />
        <Input
          size="small" name="phone" label={<Label text="Điện Thoại"/>} 
          value={observer.getBean().phone} onChange={observer.watch}
        />
        <Selection
          options={[
            { value: "1", label: t("male") },
            { value: "0", label: t("female") }
          ]}
          observer={observer} field="gender" label={"Giới Tính"}
        />
        <DatePicker
          label={t("Ngày Sinh")}
          field="birthday" observer={observer}
          defaultValue={observer.getBean().birthday ? new Date(observer.getBean().birthday) : undefined} 
        />
        <Input 
          size="small" label={<Label text="Bố"/>} 
          value={observer.getBean().father} name="father" disabled
        />
        <Input 
          size="small" label={<Label text="Mẹ"/>} 
          value={observer.getBean().mother} name="mother" disabled
        />
        <div>
          <Text.Title size="small" className="py-2"> {t("Hành động")} </Text.Title>
          <Button size="small" prefixIcon={<CommonIcon.AddPerson/>} onClick={onCreate}> 
            {t("create")}
          </Button>
        </div>
      </div>
    </Sheet>
  )
}

function Label({  text }: { text: string }) {
  return <span className="text-primary"> {t(text)} </span>
}