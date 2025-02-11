import React from "react";
import { t } from "i18next";
import { Button, Input, Sheet, Text } from "zmp-ui";

import { FamilyTreeApi } from "api";
import { StyleUtils, TreeDataProcessor } from "utils";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { CommonIcon, DatePicker, Selection } from "components";

import { FailResponse, ServerResponse } from "types/server";

import { Member } from "./UIFamilyTreeDetails";

interface UICreateChildProps {
  visible: boolean;
  dad: Member | null;
  processor: TreeDataProcessor;
  onClose: () => void;
} 

export function UICreateChild(props: UICreateChildProps) {
  const { visible, dad, processor, onClose } = props;
  const { userInfo } = useAppContext();
  const { successToast, dangerToast } = useNotification();

  if (!dad) return;

  const moms = processor.getSpouses(dad.id);
  const momOpts = moms.map((mom) => {
    return {
      value: { id: mom.id, name: mom.name }, 
      label: mom.name
    }
  }) as any[];

  
  const observer = useBeanObserver({
    father: dad.name,
    fatherId: dad.id,
    gender: "1",
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
          const bean = result.data as Member;
          onClose();
        }
        onClose();
      },
      fail: (error: FailResponse) => dangerToast?.(`${t("save")} ${t("fail")}`)
    })
  }

  return (
    <Sheet
      visible={visible} onClose={onClose}
      title={t("Tạo Con")} height={StyleUtils.calComponentRemainingHeight(0)}
    >
      <div className="scroll-v p-3">
        <Text.Title className="py-2"> {t("info")} </Text.Title>
        <div className="flex-h justify-between">
          <Selection
            options={[
              { value: "1", label: t("male") },
              { value: "0", label: t("female") }
            ]}
            observer={observer} field="gender" label={"Giới Tính"}
          />
          <Input 
            size="small" name="phone" label={<Label text="Điện Thoại"/>} 
            value={observer.getBean().phone} onChange={observer.watch}
          />
        </div>

        <div className="flex-v flex-grow-0">
          <Input 
            size="small" name="name" label={<Label text="Họ Tên"/>} 
            value={observer.getBean().name} onChange={observer.watch}
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
          <Selection
            options={momOpts}
            observer={observer} field="" label={t("Mẹ")}
            onChange={(val, action) => {
              observer.update("mother", val.name)
              observer.update("motherId", val.id)
            }}
          />
        </div>

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