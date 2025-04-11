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

  const [ filter, setFilter ] = React.useState<"income" | "expense" | "all">("all");
  const [ qrVisible, setQrVisible ] = React.useState<boolean>(false);
  const [ transactions, setTransactions ] = React.useState<any[]>([]);
  const [ transaction, setTransaction ] = React.useState<boolean>(false);
  const [ transactionType, setTransactionType ] = React.useState<"income" | "expense">("income");

  React.useEffect(() => {
    if (observer.getBean().id) {
      const incomes = observer.getBean().incomes.map(item => ({ ...item, type: 'income' }));
      const expenses = observer.getBean().expenses.map(item => ({ ...item, type: 'expense' }));
      const allTransactions = [...incomes, ...expenses];
      setTransactions(DateTimeUtils.sortByDate(allTransactions, "date"));
    }
  }, [observer]);

  const onFilterTransaction = (type: "income" | "expense" | "all") => setFilter(type);

  const onCreateTransaction = (transaction: Transaction) => {
    if (transaction.type === "income") {
      observer.pushToList("incomes", transaction);
    } else {
      observer.pushToList("expenses", transaction);
    }
  }

  const onOpenQrCode = () => setQrVisible(true);
  const onCloseQrCode = () => setQrVisible(false);

  const onOpenIncome = () => {
    setTransactionType("income");
    setTransaction(true);
  }

  const onOpenExpense = () => {
    setTransactionType("expense");
    setTransaction(true);
  }

  return (
    <div>
      <UIFundSummary className="mt-2" observer={observer} onSelect={onFilterTransaction}/>
      <Divider size={0}/>
      <UITransactions fundId={observer.getBean().id} type={filter} transactions={transactions} />

      <UIFooter 
        observer={observer} 
        onOpenExpense={onOpenExpense} onOpenIncome={onOpenIncome}
        onOpenQrCode={onOpenQrCode}
      />

      <UICreateTransaction 
        visible={transaction} 
        onClose={() => setTransaction(false)} 
        transactionType={transactionType} 
        fundId={observer.getBean().id}
        onCreateTransaction={onCreateTransaction}
      />

      <UIFundQR 
        visible={qrVisible} 
        onClose={onCloseQrCode} 
        observer={observer}
      />
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
  observer: BeanObserver<FundInfo>;
  onOpenIncome: () => void;
  onOpenExpense: () => void;
  onOpenQrCode: () => void;
}
function UIFooter({ observer, onOpenIncome, onOpenExpense, onOpenQrCode }: UIFooterProps) {
  const { userInfo } = useAppContext();
  const { loadingToast } = useNotification();
  const { goBack } = useRouteNavigate();

  const [ deleteWarningVisible, setDeleteWarningVisible ] = React.useState<boolean>(false);
  const onOpenDeleteWarning = () => setDeleteWarningVisible(true);
  const onCloseDeleteWarning = () => setDeleteWarningVisible(false);

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
                    onCloseDeleteWarning();
                    if (response.status === "success") {
                      onSuccess(t("xoá thành công"));
                      goBack();
                    } else {
                      onDanger(t("xoá thất bại"));
                    }
                  }, 
                  fail: () => {
                    onCloseDeleteWarning();
                    onDanger(t("xoá thất bại"));
                  }
                })
              },
            });
          } }
        ]}
        visible={deleteWarningVisible} onClose={onCloseDeleteWarning}
      />
    )
  }

  return (
    <div className="flex-h scroll-h px-3" style={{ position: "fixed", bottom: 20, right: 0 }}>
      <Button style={{ minWidth: 120 }} size="small" prefixIcon={<CommonIcon.QRCode/>} onClick={onOpenQrCode}>
        {t("mã QR")}
      </Button>
      <Button style={{ minWidth: 120 }} size="small" prefixIcon={<CommonIcon.Plus/>} onClick={onOpenIncome}>
        {t("thu")}
      </Button>
      <Button style={{ minWidth: 120 }} size="small" prefixIcon={<CommonIcon.Plus/>} onClick={onOpenExpense}>
        {t("chi")}
      </Button>
      <Button style={{ minWidth: 120 }} size="small" prefixIcon={<CommonIcon.Trash/>} onClick={onOpenDeleteWarning}>
        {t("delete")}
      </Button>

      {renderConfirmDelete()}
    </div>
  )
}