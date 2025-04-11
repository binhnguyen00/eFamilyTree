import React from "react";
import { t } from "i18next";
import { Button, Modal, Text } from "zmp-ui";

import { FundApi } from "api";
import { ServerResponse } from "types/server";
import { CommonUtils, DateTimeUtils, StyleUtils } from "utils";
import { useAppContext, useBeanObserver, useNotification, useRouteNavigate } from "hooks";
import { BeanObserver, CommonIcon, Divider, Header, ScrollableDiv, SizedBox } from "components";

import { FundLine } from "./UIFunds";
import { FundQR, UIFundQR } from "./UIFundQR";
import { UICreateTransaction } from "./UICreateTransaction";

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

  const [ type, setType ] = React.useState<"income" | "expense" | "all">("all");
  const [ transactions, setTransactions ] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (observer.getBean().id) {
      const incomes = observer.getBean().incomes.map(item => ({ ...item, type: 'income' }));
      const expenses = observer.getBean().expenses.map(item => ({ ...item, type: 'expense' }));
      const allTransactions = [...incomes, ...expenses];
      setTransactions(DateTimeUtils.sortByDate(allTransactions, "date"));
    }
  }, [observer]);

  const onSelect = (type: "income" | "expense" | "all") => {
    setType(type);
  }

  return (
    <div>
      <UIFundSummary className="mt-2" observer={observer} onSelect={onSelect}/>
      <Divider size={0}/>
      <UITransactions fundId={observer.getBean().id} type={type} transactions={transactions} /> {/* TODO: pass observer */}
      <UIFooter observer={observer}/>
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
        <Text size="xLarge" className="bold"> {`${CommonUtils.numberToMonetary(observer.getBean().balance)} đ`} </Text>
      </SizedBox>

      <div className="flex-h">
        <SizedBox 
          width={"50%"} height={100} 
          className="rounded flex-v center bg-green-100 button"
          onClick={() => props.onSelect("income")}
        >
          <Text size="large"> {t("incomes")} </Text>
          <Text size="large" className="text-success"> {`${CommonUtils.numberToMonetary(observer.getBean().totalIncomes)} đ`} </Text>
        </SizedBox>
        <SizedBox 
          width={"50%"} height={100} 
          className="rounded flex-v center bg-red-100 button"
          onClick={() => props.onSelect("expense")}
        >
          <Text size="large"> {t("expenses")} </Text>
          <Text size="large" className="text-danger"> {`${CommonUtils.numberToMonetary(observer.getBean().totalExpenses)} đ`} </Text>
        </SizedBox>
      </div>
    </div>
  );
}

interface Transaction extends FundLine {
  type: "income" | "expense";
}
interface UITransactionsProps {
  fundId: number;
  transactions: Transaction[];
  type: "income" | "expense" | "all";
}
function UITransactions({ fundId, transactions, type }: UITransactionsProps) {
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

interface UIFooterProps {
  observer: BeanObserver<FundInfo>;
}
function UIFooter({ observer }: UIFooterProps) {
  const { userInfo } = useAppContext();
  const { loadingToast } = useNotification();
  const { goBack } = useRouteNavigate();

  const [ qrVisible, setQrVisible ] = React.useState<boolean>(false);
  const [ deleteWarningVisible, setDeleteWarningVisible ] = React.useState<boolean>(false);

  const [ transaction, setTransaction ] = React.useState<boolean>(false);
  const [ transactionType, setTransactionType ] = React.useState<"income" | "expense">("income");

  const onOpenQrCode = () => setQrVisible(true);
  const onCloseQrCode = () => setQrVisible(false);
  const onOpenDeleteWarning = () => setDeleteWarningVisible(true);
  const onCloseDeleteWarning = () => setDeleteWarningVisible(false);

  const onOpenIncome = () => {
    setTransaction(true);
    setTransactionType("income");
  };

  const onOpenExpense = () => {
    setTransaction(true);
    setTransactionType("expense");
  };

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

      <UICreateTransaction 
        visible={transaction} 
        onClose={() => setTransaction(false)} 
        transactionType={transactionType} 
        fundId={observer.getBean().id}
      />

      <UIFundQR 
        visible={qrVisible} 
        onClose={onCloseQrCode} 
        observer={observer}
      />
    </div>
  )
}