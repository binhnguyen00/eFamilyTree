import React from "react";
import { t } from "i18next";
import { Box, Grid, Stack } from "zmp-ui";

import { FundApi } from "api";
import { ServerResponse } from "server";
import { DateTimeUtils, StyleUtils } from "utils";
import { useAppContext, useRouteNavigate } from "hooks";
import { Card, Divider, Header, Loading, ScrollableDiv } from "components";

function useFund(fundId: number) {
  const { userInfo } = useAppContext();

  const [ info, setInfo ] = React.useState<any>(undefined);
  const [ income, setIncome ] = React.useState([]);
  const [ expense, setExpense ] = React.useState([]);
  const [ loading, setLoading ] = React.useState(true);
  const [ reload, setReload ] = React.useState(false);

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      setLoading(false);
      if (result.status === "success") {
        setInfo(result.data);
      }
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

export function UIFundInfo() {
  const { belongings } = useRouteNavigate();
  const { fundId } = belongings;

  const { info, loading } = useFund(fundId);
  
  if (loading) {
    return (
      <div className="container">
        <Header title={t("funds")}/>
        <Loading/>
      </div>
    )
  }

  return (
    <div className="container">
      <UIFundSummary summary={info}/>

      <Divider/>

      <UIFundFlow 
        incomes={info?.["incomes"] || []} 
        expenses={info?.["expenses"] || []}
      />
    </div>
  )
}

// ======================================
// SUMS
// ======================================
function UIFundSummary(props: { summary: any }) {
  let { summary } = props;
  if (!summary) return <></>;

  return (
    <div className="flex-v">
      <Card className="mb-2 bg-primary" title={t("balance")} content={
        <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{summary["balance"]}</p>
      }/>

      <Grid columnCount={2} columnSpace="0.5rem">
        <Card title={t("incomes")} content={
          <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{summary["total_incomes"]}</p>
        }/>
        <Card title={t("expenses")} content={
          <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{summary["total_expenses"]}</p>
        }/>
      </Grid>
    </div>
  )
}

// ======================================
// MONEY FLOW
// ======================================
function UIFundFlow(props: { incomes: any[], expenses: any[] }) {
  let { incomes, expenses } = props;

  enum Type {
    INCOME = "income",
    EXPENSE= "expense"
  }

  const markIncome = (incomes: any[]) => {
    if (incomes.length === 0) return [];
    incomes.forEach((item) => item["type"] = Type.INCOME)
    return incomes;
  }

  const markExpense = (expends: any[]) => {
    if (expends.length === 0) return [];
    expends.forEach((item) => item["type"] = Type.EXPENSE)
    return expends;
  }

  incomes = markIncome(incomes);
  expenses = markExpense(expenses);
  const flow = DateTimeUtils.sortByDate([...incomes, ...expenses], "date");

  let html = [] as React.ReactNode[];
  if (flow.length === 0) return html;

  flow.map((item, index) => {
    const isIncome = item["type"] === Type.INCOME;
    const amount = Number.parseFloat(item["amount"]);
    html.push(
      <Box 
        flex flexDirection="row" justifyContent="space-between"
        className="mt-2 p-3 bg-secondary text-primary rounded"
      >
        <Stack space="0.5rem">
          <h3> {`${isIncome ? "+" : "-"} ${amount}`} </h3>
          <p> {item["note"] || ""} </p>
        </Stack>
        <p> {item["date"]} </p>
      </Box>
    )
  })

  return (
    <div className="flex-v">
      <span> {t("transaction_history")} </span>
      <ScrollableDiv direction="vertical" height={StyleUtils.calComponentRemainingHeight(250)}>
        {html}  
      </ScrollableDiv>
    </div>
  )
}