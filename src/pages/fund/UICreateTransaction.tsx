import React from "react";
import { t } from "i18next";
import { Button, DatePicker, Input, Sheet } from "zmp-ui";
import { CommonIcon, InputMonetary, ScrollableDiv, Selection, SelectionOption } from "components";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { useGetActiveMembers } from "pages/family-tree/UIFamilyTree";
import { DateTimeUtils } from "utils";
import { FundLine } from "./UIFunds";
import { ServerResponse } from "types/server";
import { FundApi } from "api";

interface UICreateTransactionProps {
  fundId: number;
  visible: boolean;
  onClose: () => void;
  transactionType: "income" | "expense";
}

export function UICreateTransaction(props: UICreateTransactionProps) {
  const { fundId, visible, transactionType, onClose } = props;
  const { userInfo } = useAppContext();
  const { loadingToast, warningToast } = useNotification();
  const { activeMembers } = useGetActiveMembers(userInfo.id, userInfo.clanId);

  const transactionObserver = useBeanObserver({
    name: "",
    picId: 0,
    amount: 1000000,
    date: DateTimeUtils.formatToDate(new Date()),
    note: "",
  } as FundLine);

  const onSave = () => {
    if (
      !transactionObserver.getBean().amount
      || !transactionObserver.getBean().date
      // || !transactionObserver.getBean().picId
    ) {
      warningToast(t("nhập đủ thông tin"))
      return;
    }
    
    loadingToast({
      content: t("đang lưu..."),
      operation(onSuccess, onFail, onDismiss) {
        const transaction = {
          userId:       userInfo.id,
          clanId:       userInfo.clanId,
          fundId:       fundId,
          transaction:  transactionObserver.getBean(),
          success: (response: ServerResponse) => {
            if (response.status === "success") {
              onSuccess(t("lưu thành công"));
            } else {
              onFail(t("lưu thất bại"));
            }
          },
          fail: () => {
            onFail(t("lưu thất bại"));
          }
        }
        if (transactionType === "income") {
          FundApi.addIncome(transaction);
        } else {
          FundApi.addExpense(transaction);
        }
      },
    })
  }

  return (
    <Sheet title={transactionType === "income" ? t("Thu") : t("Chi")} visible={visible} onClose={onClose}>
      <ScrollableDiv className="flex-v p-3" direction="vertical" height={"80vh"}>
        <Input.TextArea label={t("nội dung")}
          value={transactionObserver.getBean().note} 
          onChange={(e) => transactionObserver.update("note", e.target.value)}
        />
        <InputMonetary
          label={`${t("số tiền")} *`} field="amount" 
          value={transactionObserver.getBean().amount} onChange={transactionObserver.watch}
        />
        <DatePicker
          mask maskClosable
          label={`${t("Thu/Chi ngày")} *`} title={t("ngày")} defaultValue={new Date()}
          onChange={(date: Date, calendarDate: any) => {
            transactionObserver.update("date", DateTimeUtils.formatToDate(date));
          }}
        />
        <Selection
          label={`${t("Người Thu/Chi")} *`} field={"picId"} 
          options={activeMembers} observer={transactionObserver} isSearchable
          defaultValue={{ value: userInfo.id, label: userInfo.name }}
          onChange={(value: SelectionOption) => {
            transactionObserver.update("picId", value.value);
            transactionObserver.update("name", value.label);
          }}
        />
        <div className="flex-h" style={{ position: "fixed", bottom: 20, right: 10}}>
          <Button style={{ minWidth: 120 }} size="small" prefixIcon={<CommonIcon.Save/>} onClick={onSave}>
            {t("save")}
          </Button>
        </div>
      </ScrollableDiv>
    </Sheet>
  )
}