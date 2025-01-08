import React from "react";
import { t } from "i18next";
import { Box, Grid, Stack, Text } from "zmp-ui";

import { FundApi } from "api";
import { DateTimeUtils, StyleUtils } from "utils";
import { useAppContext, useRouteNavigate } from "hooks";
import { Card, Divider, Header, Loading, ScrollableDiv } from "components";

import data from "./sample/fund.json";

export default function UIDummyFundDetail() {
  const { belongings } = useRouteNavigate();
  const { fundId } = belongings;

  const { info, loading } = useFund(fundId);

  return (
    <div className="container">
      <Header title={t("funds")}/>
        
      <UIFundDetailContainer fundInfo={info} loading={loading}/>
    </div>
  )
}

function useFund(fundId: number) {
  const { userInfo } = useAppContext();

  const [ info, setInfo ] = React.useState<any>(data);
  const [ income, setIncome ] = React.useState([]);
  const [ expense, setExpense ] = React.useState([]);
  const [ loading, setLoading ] = React.useState(false); // Change back to false
  const [ reload, setReload ] = React.useState(false);

  React.useEffect(() => {
    const success = () => {
    }
    FundApi.getFundById(fundId, userInfo.id, userInfo.clanId, success);
  }, [ reload ])

  return {
    info: info,
    income: income,
    expense: expense,
    loading: loading,
    update: setInfo,
    refresh: () => setReload(!reload),
  } 
}

interface UIFundDetailContainerProps {
  fundInfo: any;
  loading: boolean;
}
function UIFundDetailContainer(props: UIFundDetailContainerProps) {
  const { fundInfo, loading } = props;

  // Lift the state up to the container
  const [currentView, setCurrentView] = React.useState<'all' | 'incomes' | 'expenses'>('all');
  const [sortedTransactions, setSortedTransactions] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (fundInfo) {
      updateTransactions(currentView);
    }
  }, [fundInfo, currentView]);

  const updateTransactions = (view: 'all' | 'incomes' | 'expenses') => {
    const sortedIncomes = DateTimeUtils.sortByDate([...fundInfo.incomes], "date").map(item => ({
      ...item,
      type: 'income'
    }));
    
    const sortedExpenses = DateTimeUtils.sortByDate([...fundInfo.expenses], "date").map(item => ({
      ...item,
      type: 'expense'
    }));

    switch (view) {
      case 'incomes':
        setSortedTransactions(sortedIncomes);
        break;
      case 'expenses':
        setSortedTransactions(sortedExpenses);
        break;
      case 'all':
        setSortedTransactions(DateTimeUtils.sortByDate([...sortedIncomes, ...sortedExpenses], "date"));
        break;
    }
  };

  if (loading) {
    return (
      <div>
        <Header title={t("funds")}/>
        <Loading/>
      </div>
    );
  }

  return (
    <div>
      <UIFundSummary 
        summary={fundInfo}
        onViewChange={setCurrentView}
      />

      <Divider/>

      <UIFundFlow transactions={sortedTransactions} />
    </div>
  );
}

interface UIFundSummaryProps {
  summary: any;
  onViewChange: (view: 'all' | 'incomes' | 'expenses') => void;
}
function UIFundSummary({ summary, onViewChange }: UIFundSummaryProps) {
  return (
    <div className="flex-v">
      <Card 
        onClick={() => onViewChange('all')}
        className="mb-2 bg-primary" 
        title={t("balance")} 
        content={
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {summary.balance}
          </p>
        }
      />

      <Grid columnCount={2} columnSpace="0.5rem">
        <Card 
          onClick={() => onViewChange('incomes')}
          className="bg-primary" 
          title={t("incomes")} 
          content={
            <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              {summary.total_incomes}
            </p>
          }
        />
        <Card 
          onClick={() => onViewChange('expenses')}
          className="bg-primary" 
          title={t("expenses")} 
          content={
            <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              {summary.total_expenses}
            </p>
          }
        />
      </Grid>
    </div>
  );
}

interface UIFundFlowProps {
  transactions: any[];
}

function UIFundFlow({ transactions }: UIFundFlowProps) {
  if (transactions.length === 0) return null;

  return (
    <div className="flex-v">
      <span>{t("transaction_history")}</span>
      <ScrollableDiv direction="vertical" height={StyleUtils.calComponentRemainingHeight(250)}>
        {transactions.map((item, index) => (
          <Box 
            key={index}
            flex 
            flexDirection="row" 
            justifyContent="space-between"
            className="mt-2 p-3 bg-secondary text-primary rounded"
          >
            <Stack space="0.5rem">
              <div className="flex-h justify-between">
                <p style={{ fontSize: "1.2rem" }}>
                  {`${item.type === 'income' ? '+' : '-'} ${item.amount}`}
                </p>
                <p>{item.date}</p>
              </div>
              <p>{item.note || ""}</p>
            </Stack>
          </Box>
        ))}
      </ScrollableDiv>
    </div>
  );
}