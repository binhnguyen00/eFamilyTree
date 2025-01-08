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

  if (loading) {
    return (
      <div>
        <Header title={t("funds")}/>
        <Loading/>
      </div>
    )
  }

  return (
    <div>
      <UIFundInfo summary={fundInfo}/>

      <Divider/>

      <UIFundFlow 
        incomes={fundInfo?.["incomes"] || []} 
        expenses={fundInfo?.["expenses"] || []}
      />
    </div>
  )
}

function UIFundInfo(props: { summary: any }) {
  let { summary } = props;

  return (
    <div className="flex-v">
      <Card className="mb-2 bg-primary" title={t("balance")} content={
        <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{summary["balance"]}</p>
      }/>

      <Grid columnCount={2} columnSpace="0.5rem">
        <Card title={t("incomes")} className="bg-primary" content={
          <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{summary["total_incomes"]}</p>
        }/>
        <Card title={t("expenses")} className="bg-primary" content={
          <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{summary["total_expenses"]}</p>
        }/>
      </Grid>
    </div>
  )
}

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
    const totalAmount = Number.parseFloat(item["amount"]);
    const formatted = new Intl.NumberFormat('id-ID').format(totalAmount)
    html.push(
      <Box 
        flex flexDirection="row" justifyContent="space-between"
        className="mt-2 p-3 bg-secondary text-primary rounded"
      >
        <Stack space="0.5rem">
          <Text.Title> {`${isIncome ? "+" : "-"} ${formatted}`} </Text.Title>
          <Text> {item["note"] || ""} </Text>
        </Stack>
        <Text> {item["date"]} </Text>
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