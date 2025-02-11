import React from "react";
import { t } from "i18next";
import { Button, Input, Sheet, Text } from "zmp-ui";

import { StyleUtils } from "utils";
import { FamilyTreeApi } from "api";
import { CommonIcon, DatePicker, Selection } from "components";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { FailResponse, ServerResponse } from "types/server";

import { Member } from "./UIFamilyTreeDetails";

interface UICreateRootProps {
  visible: boolean;
}
export function UICreateRoot(props: UICreateRootProps) {
  const { visible } = props;

  const observer = useBeanObserver({} as Member)
  const { userInfo } = useAppContext();
  const { successToast, dangerToast } = useNotification();

  const onCreate = () => {
    console.log(observer.getBean());
    
    FamilyTreeApi.saveMember({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      member: observer.getBean(),
      success: (result: ServerResponse) => {
        if (result.status === "error") {
          dangerToast(`${t("save")} ${t("fail")}`)
        } else {
          successToast(`${t("save")} ${t("success")}`)
          const bean = result.data as Member;
          // observer.updateBean(bean)
        }
      },
      fail: (error: FailResponse) => {
        dangerToast(`${t("save")} ${t("fail")}`)
      }
    })
  }

  return (
    <Sheet
      visible={visible}
      height={StyleUtils.calComponentRemainingHeight(0)}
      title={t("Tạo Thành Viên Đầu Tiên")}
      swipeToClose={false}
    >
      <div className="px-2">
        <div>
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
          
          <div className="flex-v">
            <Input 
              size="small" name="name" className="mt-1" label={<Label text="Họ Tên"/>} 
              value={observer.getBean().name} onChange={observer.watch}
            />
            <DatePicker
              label={t("Ngày Sinh")}
              field="birthDay" observer={observer}
              defaultValue={observer.getBean().birthDay ? new Date(observer.getBean().birthDay) : undefined} 
            />
          </div>
        </div>
        
        <div>
          <Text.Title size="small" className="py-2"> {t("Hành động")} </Text.Title>
          <Button size="small" prefixIcon={<CommonIcon.Save/>} onClick={onCreate}> 
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