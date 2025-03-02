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
      <Header title={t("funds")}/>

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
      <SizedBox width={"100%"} height={100} className="rounded flex-v center" border>
        <Text.Title> {t("balance")} </Text.Title>
        <Text> {observer.getBean().balance} </Text>
      </SizedBox>

      <div className="flex-h">
        <SizedBox width={"50%"} height={100} className="rounded flex-v center" border>
          <Text.Title> {t("incomes")} </Text.Title>
          <Text className="text-success"> {observer.getBean().totalIncomes} </Text>
        </SizedBox>
        <SizedBox width={"50%"} height={100} className="rounded flex-v center" border>
          <Text.Title> {t("expenses")} </Text.Title>
          <Text className="text-danger"> {observer.getBean().totalExpenses} </Text>
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
          <Text className={color}> {`${sign} ${transaction.amount}`} </Text>
          <Text> {transaction.name} {transaction.note} </Text>
        </div>
        <Text> {transaction.date} </Text>
      </div>
    );
  }

  const lines = React.useMemo(() => {
    return transactions.map((item, index) => (
      <React.Fragment>
        {renderTransaction(item)}

        <hr/>
      </React.Fragment>
    ));
  }, [transactions]);

  return (
    <div className="flex-v">
      <span>{t("transaction_history")}</span>
      <ScrollableDiv className="flex-v" direction="vertical" height={StyleUtils.calComponentRemainingHeight(100*2 + 44 + 15)}>
        {lines}
      </ScrollableDiv>
    </div>
  );
}