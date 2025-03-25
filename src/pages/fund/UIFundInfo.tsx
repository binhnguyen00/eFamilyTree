import React from "react";
import { t } from "i18next";
import { Text } from "zmp-ui";

import { DateTimeUtils, StyleUtils } from "utils";
import { useBeanObserver, useRouteNavigate } from "hooks";
import { BeanObserver, Divider, Header, ScrollableDiv, SizedBox } from "components";

import { FundLine } from "./UIFunds";

export interface FundInfo {
  id: number,
  name: string,
  balance: string,
  totalIncomes: string,
  totalExpenses: string,
  incomes: FundLine[],
  expenses: FundLine[],
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

  const [ transactions, setTransactions ] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (observer.getBean().id) {
      const incomes = observer.getBean().incomes.map(item => ({ ...item, type: 'income' }));
      const expenses = observer.getBean().expenses.map(item => ({ ...item, type: 'expense' }));
      const allTransactions = [...incomes, ...expenses];
      setTransactions(DateTimeUtils.sortByDate(allTransactions, "date"));
    }
  }, [observer]);

  return (
    <div>
      <UIFundSummary observer={observer} className="mt-2"/>
      <Divider size={0}/>
      <UITransactions transactions={transactions} /> {/* TODO: pass observer */}
    </div>
  );
}

interface UIFundSummaryProps {
  observer: BeanObserver<FundInfo>;
  className?: string;
}
function UIFundSummary(props: UIFundSummaryProps) {
  const { observer, className } = props;

  return (
    <div className="flex-v">
      <SizedBox 
        width={"100%"} height={120} 
        className={`rounded flex-v center text-primary button bg-secondary ${className}`.trim()}
      >
        <Text.Title size="large"> {t("balance")} </Text.Title>
        <Text size="xLarge" className="bold"> {`${observer.getBean().balance} đ`} </Text>
      </SizedBox>

      <div className="flex-h">
        <SizedBox width={"50%"} height={100} className="rounded flex-v center bg-green-100 button">
          <Text size="large"> {t("incomes")} </Text>
          <Text size="large" className="text-success"> {`+${observer.getBean().totalIncomes} đ`} </Text>
        </SizedBox>
        <SizedBox width={"50%"} height={100} className="rounded flex-v center bg-red-100 button">
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
}
function UITransactions({ transactions }: UITransactionsProps) {
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
    return transactions.map((item, index) => (
      <React.Fragment key={`transaction-${index}`}>
        {renderTransaction(item)}
        <Divider/>
      </React.Fragment>
    ));
  }, [transactions]);

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
