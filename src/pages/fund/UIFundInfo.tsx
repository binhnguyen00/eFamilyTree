import React from "react";
import { t } from "i18next";
import { Button, Text } from "zmp-ui";

import { DateTimeUtils, StyleUtils } from "utils";
import { useBeanObserver, useRouteNavigate } from "hooks";
import { BeanObserver, Header, ScrollableDiv, SizedBox } from "components";

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

      <div className="container bg-white text-base">
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
    <div className="flex-v flex-grow-0">
      <UIFundSummary observer={observer}/>
      <UITransactions transactions={transactions} /> {/* TODO: pass observer */}
    </div>
  );
}

interface UIFundSummaryProps {
  observer: BeanObserver<FundInfo>;
}
function UIFundSummary(props: UIFundSummaryProps) {
  const { observer } = props;

  return (
    <div className="flex-v">
      <SizedBox width={"100%"} height={120} className="rounded flex-v center mb-3" border>
        <Text.Title className="text-lg text-gray-800"> {t("balance")} </Text.Title>
        <Text className="font-bold text-3xl text-primary"> {observer.getBean().balance} đ</Text>
      </SizedBox>

      <div className="flex-h mb-3 gap-2">
        <SizedBox width={"50%"} height={100} className="rounded flex-v center bg-green-50" border>
          <Text.Title className="text-gray-600"> {t("incomes")} </Text.Title>
          <Text className="text-success font-bold text-xl"> +{observer.getBean().totalIncomes} đ</Text>
        </SizedBox>
        <SizedBox width={"50%"} height={100} className="rounded flex-v center bg-red-50" border>
          <Text.Title className="text-gray-600"> {t("expenses")} </Text.Title>
          <Text className="text-danger font-bold text-xl"> -{observer.getBean().totalExpenses} đ</Text>
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
      <div className="flex-h flex-grow-0 justify-between p-2">
        <div className="flex-v">
          <Text className={`${color} font-semibold`}> {`${sign} ${transaction.amount}`} </Text>
          <Text className="text-sm"> {transaction.name} </Text>
          {transaction.note && <Text className="text-xs text-gray-500"> {transaction.note} </Text>}
        </div>
        <Text className="text-xs text-gray-500"> {transaction.date} </Text>
      </div>
    );
  }

  const lines = React.useMemo(() => {
    return transactions.map((item, index) => (
      <React.Fragment key={`transaction-${index}`}>
        {renderTransaction(item)}
        <hr className="my-1"/>
      </React.Fragment>
    ));
  }, [transactions]);

  return (
    <div className="flex-v mt-4">
      <Text.Title className="mb-2">{t("transaction_history")}</Text.Title>
      <ScrollableDiv 
        className="flex-v rounded border p-2" 
        direction="vertical" 
        height={StyleUtils.calComponentRemainingHeight(100*2 + 44 + 15)}
      >
        {lines}
      </ScrollableDiv>
    </div>
  );
}
