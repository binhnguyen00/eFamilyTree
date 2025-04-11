import React from "react";
import { t } from "i18next";
import { Modal, Text } from "zmp-ui";

import { FundApi } from "api";
import { ServerResponse } from "types/server";
import { CommonUtils, StyleUtils } from "utils";
import { useAppContext, useNotification } from "hooks";
import { Divider, ScrollableDiv } from "components";

import { FundLine } from "../UIFunds";

export interface Transaction extends FundLine {
  type: "income" | "expense";
}
interface UITransactionsProps {
  fundId: number;
  transactions: Transaction[];
  type: "income" | "expense" | "all";
}
export function UITransactions({ fundId, transactions, type }: UITransactionsProps) {
  if (transactions.length === 0) return null;

  const { loadingToast } = useNotification();
  const { userInfo } = useAppContext();
  const [ deleteWarningVisible, setDeleteWarningVisible ] = React.useState(false);
  const [ transactionToDelete, setTransactionToDelete ] = React.useState<Transaction | null>(null);

  const renderTransaction = (transaction: Transaction) => {
    const sign = transaction.type === "income" ? "+" : "-";
    const color = transaction.type === "income" ? "text-success" : "text-danger";
    return (
      <div className="flex-h flex-grow-0 justify-between button" onClick={() => {
        setDeleteWarningVisible(true);
        setTransactionToDelete(transaction);
      }}>
        <div className="flex-v">
          <Text className={`${color}`}> {`${sign} ${CommonUtils.numberToMonetary(transaction.amount)}`} </Text>
          <Text className="text-sm"> {transaction.name} </Text>
          {transaction.note && <Text className="text-gray-500"> {transaction.note} </Text>}
        </div>
        <Text className="text-gray-500"> {transaction.date} </Text>
      </div>
    );
  }

  const renderDeleteTransaction = () => {
    if (!transactionToDelete) return null;

    return (
      <Modal
        visible={deleteWarningVisible} onClose={() => setDeleteWarningVisible(false)}
        title={t("Xoá Giao Dịch")}
        description={t("hành động không thể hoàn tác. bạn có chắc chắn muốn xóa giao dịch này?")}
        actions={[
          { text: t("close"), close: true },
          { text: `🗑️ ${t("xóa")}`, onClick: () => {
            loadingToast({
              content: t("đang xóa..."),
              operation(onSuccess, onDanger, onDismiss) {
                FundApi.deleteTransaction({
                  id:      transactionToDelete.id,
                  userId:  userInfo.id,
                  clanId:  userInfo.clanId,
                  fundId:  fundId,
                  type:    transactionToDelete.type,
                  success: (response: ServerResponse) => {
                    setDeleteWarningVisible(false);
                    if (response.status === "success") {
                      onSuccess(t("xoá thành công"));
                    } else {
                      onDanger(t("xoá thất bại"));
                    }
                  },
                  fail: () => {
                    setDeleteWarningVisible(false);
                    onDanger(t("xoá thất bại"));
                  }
                })
              },
            });
          } }
        ]}
      />
    )
  }

  const lines = React.useMemo(() => {
    if (type === "all") {
      return transactions.map((item, index) => (
        <React.Fragment key={`transaction-${index}`}>
          {renderTransaction(item)}
          <Divider/>
        </React.Fragment>
      ));
    } else if (type === "income") {
      return transactions.filter(item => item.type === "income").map((item, index) => (
        <React.Fragment key={`transaction-${index}`}>
          {renderTransaction(item)}
          <Divider/>
        </React.Fragment>
      ));
    } else {
      return transactions.filter(item => item.type === "expense").map((item, index) => (
        <React.Fragment key={`transaction-${index}`}>
          {renderTransaction(item)}
          <Divider/>
        </React.Fragment>
      ));
    }
  }, [ type, transactions ]);

  return (
    <div className="flex-v">
      <Text size="large" className="text-center bold">{t("transaction_history")}</Text>
      <ScrollableDiv 
        className="flex-v" direction="vertical" 
        height={StyleUtils.calComponentRemainingHeight(120*2 + 50)}
      >
        {lines}
        {renderDeleteTransaction()}
        <br/>
        <br/>
      </ScrollableDiv>
    </div>
  );
}