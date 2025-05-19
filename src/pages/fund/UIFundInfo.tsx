import React from "react";
import { t } from "i18next";
import { Button, Modal, Text } from "zmp-ui";

import { FundApi } from "api";
import { ServerResponse } from "types/server";
import { CommonUtils, DateTimeUtils } from "utils";
import { useAppContext, useBeanObserver, useNotification, useRouteNavigate } from "hooks";
import { BeanObserver, CommonIcon, Divider, Header, SizedBox } from "components";

import { FundLine } from "./UIFunds";
import { FundQR, UIFundQR } from "./UIFundQR";
import { UICreateTransaction } from "./transaction/UICreateTransaction";
import { Transaction, UITransactions } from "./transaction/UITransactionList";

export interface FundInfo {
  id: number,
  name: string,
  balance: number,
  totalIncomes: number,
  totalExpenses: number,
  incomes: FundLine[],
  expenses: FundLine[],
  qrCode: FundQR,
}

export function UIFundInfo() {
  const { belongings } = useRouteNavigate();
  const { fund } = belongings;

  const observer = useBeanObserver(fund as FundInfo);

  return (
    <>
      <Header title={fund.name}/>

      <div className="container max-h bg-white text-base">
        <UIFundContainer observer={observer}/>
      </div>
    </>
  )
}

interface UIFundContainerProps {
  observer: BeanObserver<FundInfo>;
}
function UIFundContainer(props: UIFundContainerProps) {
  const { observer } = props;
  const { goBack } = useRouteNavigate();
  const { userInfo } = useAppContext();
  const { loadingToast } = useNotification();
  
  const [ filter, setFilter ] = React.useState<"income" | "expense" | "all">("all");
  const [ qrVisible, setQrVisible ] = React.useState<boolean>(false);
  const [ transactions, setTransactions ] = React.useState<any[]>([]);
  const [ transaction, setTransaction ] = React.useState<boolean>(false);
  const [ transactionType, setTransactionType ] = React.useState<"income" | "expense">("income");
  
  const [ deleteWarningVisible, setDeleteWarningVisible ] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (observer.getBean().id) {
      const incomes = observer.getBean().incomes.map(item => ({ ...item, type: 'income' }));
      const expenses = observer.getBean().expenses.map(item => ({ ...item, type: 'expense' }));
      const allTransactions = [...incomes, ...expenses];
      setTransactions(DateTimeUtils.sortByDate(allTransactions, "date"));
    }
  }, [ observer ]);

  const onCreateTransaction = (transaction: Transaction) => {
    if (transaction.type === "income") {
      observer.pushToList("incomes", transaction);
      observer.update("totalIncomes", observer.getBean().totalIncomes + transaction.amount);
      observer.update("balance", observer.getBean().balance + transaction.amount);
      setTransaction(false);
    } else {
      observer.pushToList("expenses", transaction);
      observer.update("totalExpenses", observer.getBean().totalExpenses + transaction.amount);
      observer.update("balance", observer.getBean().balance - transaction.amount);
      setTransaction(false);
    }
  }

  const onDeleteTransaction = (transaction: Transaction) => {
    if (transaction.type === "income") {
      observer.update("incomes", observer.getBean().incomes.filter(item => item.id !== transaction.id));
      observer.update("totalIncomes", observer.getBean().totalIncomes - transaction.amount);
      observer.update("balance", observer.getBean().balance - transaction.amount);
    } else {
      observer.update("expenses", observer.getBean().expenses.filter(item => item.id !== transaction.id));
      observer.update("totalExpenses", observer.getBean().totalExpenses - transaction.amount);
      observer.update("balance", observer.getBean().balance + transaction.amount);
    }
  }

  const onFilterTransaction = (type: "income" | "expense" | "all") => setFilter(type);
  const onOpenQrCode = () => setQrVisible(true);
  const onCloseQrCode = () => setQrVisible(false);
  const onOpenIncome = () => { setTransactionType("income"); setTransaction(true); }
  const onOpenExpense = () => { setTransactionType("expense"); setTransaction(true); }
  const onDelete = () => {
    setDeleteWarningVisible(true);
  }

  // TODO: consider move to a separate component
  const renderConfirmDelete = () => {
    return (
      <Modal 
        title={t("Xoá Quỹ")}
        description={t("hành động không thể hoàn tác, bạn có chắc chắn muốn xóa quỹ này?")}
        actions={[
          { text: t("close"), close: true },
          { text: `🗑️ ${t("xóa")}`, onClick: () => {
            loadingToast({
              content: t("đang xóa..."),
              operation(onSuccess, onDanger, onDismiss) {
                FundApi.deleteFund({
                  id: observer.getBean().id,
                  userId: userInfo.id,
                  clanId: userInfo.clanId,
                  success: (response: ServerResponse) => {
                    setDeleteWarningVisible(false);
                    if (response.status === "success") {
                      onSuccess(t("xoá thành công"));
                      goBack();
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
        visible={deleteWarningVisible} onClose={() => setDeleteWarningVisible(false)}
      />
    )
  }

  return (
    <div>
      <UIFundSummary className="mt-2" observer={observer} onSelect={onFilterTransaction}/>

      <Divider size={0}/>

      <UITransactions 
        type={filter} 
        transactions={transactions} 
        fundId={observer.getBean().id} 
        onDelete={onDeleteTransaction}
      />

      <UIFooter 
        onOpenExpense={onOpenExpense} onOpenIncome={onOpenIncome}
        onOpenQrCode={onOpenQrCode} onDelete={onDelete}
      />

      <UICreateTransaction 
        visible={transaction} 
        onClose={() => setTransaction(false)} 
        transactionType={transactionType} 
        fundId={observer.getBean().id}
        onCreate={onCreateTransaction}
      />

      <UIFundQR visible={qrVisible} observer={observer} onClose={onCloseQrCode} />

      {renderConfirmDelete()}
    </div>
  );
}

interface UIFundSummaryProps {
  observer: BeanObserver<FundInfo>;
  onSelect: (type: "income" | "expense" | "all") => void;
  className?: string;
}
function UIFundSummary(props: UIFundSummaryProps) {
  const { observer, className } = props;

  return (
    <div className="flex-v">
      <SizedBox 
        width={"100%"} height={120} 
        className={`rounded flex-v center text-primary button bg-secondary ${className}`.trim()}
        onClick={() => props.onSelect("all")}
      >
        <Text.Title size="large"> {t("balance")} </Text.Title>
        <Text size="xLarge" className="bold"> {CommonUtils.numberToMonetary(observer.getBean().balance)} </Text>
      </SizedBox>

      <div className="flex-h">
        <SizedBox 
          width={"50%"} height={100} 
          className="rounded flex-v center bg-green-100 button"
          onClick={() => props.onSelect("income")}
        >
          <Text size="large"> {t("incomes")} </Text>
          <Text size="large" className="text-success"> {CommonUtils.numberToMonetary(observer.getBean().totalIncomes)} </Text>
        </SizedBox>
        <SizedBox 
          width={"50%"} height={100} 
          className="rounded flex-v center bg-red-100 button"
          onClick={() => props.onSelect("expense")}
        >
          <Text size="large"> {t("expenses")} </Text>
          <Text size="large" className="text-danger"> {CommonUtils.numberToMonetary(observer.getBean().totalExpenses)} </Text>
        </SizedBox>
      </div>
    </div>
  );
}

interface UIFooterProps {
  onOpenIncome: () => void;
  onOpenExpense: () => void;
  onOpenQrCode: () => void;
  onDelete: () => void;
}
function UIFooter(props: UIFooterProps) {
  const { onOpenIncome, onOpenExpense, onOpenQrCode, onDelete } = props;

  return (
    <div className="flex-h scroll-h px-3" style={{ position: "fixed", bottom: 30, right: 0 }}>
      <Button className="button-success" style={{ minWidth: 100 }} size="small" prefixIcon={<CommonIcon.Plus/>} onClick={onOpenIncome}>
        {t("thu")}
      </Button>
      <Button className="button-danger" style={{ minWidth: 100 }} size="small" prefixIcon={<CommonIcon.Plus/>} onClick={onOpenExpense}>
        {t("chi")}
      </Button>
      <Button style={{ minWidth: 120 }} size="small" prefixIcon={<CommonIcon.QRCode/>} onClick={onOpenQrCode}>
        {t("mã QR")}
      </Button>
      <Button style={{ minWidth: 120 }} size="small" prefixIcon={<CommonIcon.Trash/>} onClick={onDelete}>
        {t("delete")}
      </Button>
    </div>
  )
}