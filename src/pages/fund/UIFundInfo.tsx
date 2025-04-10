import React from "react";
import { t } from "i18next";
import { Button, Text } from "zmp-ui";

import { DateTimeUtils, StyleUtils } from "utils";
import { useBeanObserver, useRouteNavigate } from "hooks";
import { BeanObserver, CommonIcon, Divider, Header, ScrollableDiv, SizedBox } from "components";

import { FundLine } from "./UIFunds";
import { FundQR, UIFundQR } from "./UIFundQR";

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
      <UITransactions type={type} transactions={transactions} /> {/* TODO: pass observer */}
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
        <Text size="xLarge" className="bold"> {`${observer.getBean().balance} đ`} </Text>
      </SizedBox>

      <div className="flex-h">
        <SizedBox 
          width={"50%"} height={100} 
          className="rounded flex-v center bg-green-100 button"
          onClick={() => props.onSelect("income")}
        >
          <Text size="large"> {t("incomes")} </Text>
          <Text size="large" className="text-success"> {`+${observer.getBean().totalIncomes} đ`} </Text>
        </SizedBox>
        <SizedBox 
          width={"50%"} height={100} 
          className="rounded flex-v center bg-red-100 button"
          onClick={() => props.onSelect("expense")}
        >
          <Text size="large"> {t("expenses")} </Text>
          <Text size="large" className="text-danger"> {`-${observer.getBean().totalExpenses} đ`} </Text>
        </SizedBox>
      </div>
    </div>
  );
}

interface Transaction extends FundLine {
  type: "income" | "expense";
}
interface UITransactionsProps {
  transactions: Transaction[];
  type: "income" | "expense" | "all";
}
function UITransactions({ transactions, type }: UITransactionsProps) {
  if (transactions.length === 0) return null;

  const renderTransaction = (transaction: Transaction) => {
    const sign = transaction.type === "income" ? "+" : "-";
    const color = transaction.type === "income" ? "text-success" : "text-danger";
    return (
      <div className="flex-h flex-grow-0 justify-between">
        <div className="flex-v">
          <Text className={`${color}`}> {`${sign} ${transaction.amount}`} </Text>
          <Text className="text-sm"> {transaction.name} </Text>
          {transaction.note && <Text className="text-gray-500"> {transaction.note} </Text>}
        </div>
        <Text className="text-gray-500"> {transaction.date} </Text>
      </div>
    );
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
      </ScrollableDiv>
    </div>
  );
}

interface UIFooterProps {
  observer: BeanObserver<FundInfo>;
}
function UIFooter({ observer }: UIFooterProps) {
  const [ visible, setVisible ] = React.useState<boolean>(false);

  const openQrCode = () => setVisible(true);
  const closeQrCode = () => setVisible(false);

  return (
    <div className="flex-v" style={{ position: "fixed", bottom: 20, right: 10 }}>
      <Button size="small" prefixIcon={<CommonIcon.QRCode/>} onClick={openQrCode}>
        {t("mã QR")}
      </Button>

      <UIFundQR 
        visible={visible} onClose={closeQrCode}
        title={observer.getBean().name} fundQR={observer.getBean().qrCode}
      />
    </div>
  )
}
