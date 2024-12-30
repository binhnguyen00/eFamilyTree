import React from "react";
import { useLocation } from 'react-router-dom';

import { t } from "i18next";
import { Box, Stack, Text } from "zmp-ui";

import { DateTimeUtils } from "utils/DateTimeUtils";
import { Header } from "components";

import { SearchBar } from "components/common/SearchBar";

export function UIFundDetail() {
  const location = useLocation();
  const { fund } = location.state || null;

  const type = {
    1: "income",
    0: "expense"
  }

  const markIncome = (incomes: any[]) => {
    if (incomes.length === 0) return [];
    incomes.forEach((item) => {
      item["type"] = type[1];
    })
    return incomes;
  }

  const markExpense = (expends: any[]) => {
    if (expends.length === 0) return [];
    expends.forEach((item) => {
      item["type"] = type[0];
    })
    return expends;
  }

  const renderIOComes = () => {
    const incomes = markIncome(fund["income_ids"] || []);
    const expends = markExpense(fund["expense_ids"] || []);
    const flow = DateTimeUtils.sortByDate([...incomes, ...expends], "date");
    const total = flow.reduce((acc, item) => {
      const amount = Number.parseFloat(item["amount"]);
      if (incomes.includes(item)) return acc + amount;
      else return acc - amount;
    }, 0);

    let html = [] as React.ReactNode[];
    if (flow.length === 0) return html;

    html.push(
      <Box 
        flex flexDirection="row" justifyContent="space-between"
        className="p-3 bg-secondary text-primary rounded"
      >
        <Text.Title> 
          {`${t("total")}: ${new Intl.NumberFormat('id-ID').format(Number.parseFloat(total))}`}
        </Text.Title>
      </Box>
    )
    flow.map((item, index) => {
      const isIncome = item["type"] === "income";
      const formatted = new Intl.NumberFormat('id-ID').format(item["amount"])
      html.push(
        <Box 
          flex flexDirection="row" justifyContent="space-between"
          className="mt-2 p-3 bg-secondary text-primary rounded"
        >
          <Stack space="0.5rem">
            <Text.Title> {`${isIncome ? "+" : "-"} ${formatted}`} </Text.Title>
            <Text> {item["name"] || ""} </Text>
            <Text> {item["note"] || ""} </Text>
          </Stack>
          <Text> {item["date"]} </Text>
        </Box>
      )
    })

    return (
      <div className="flex-v">
        {html}
      </div>
    )
  }

  return (
    <div className="container">
      <Header title={fund.name}/>

      <SearchBar 
        placeholder={t("search_funds")}
        onSearch={(text, event) => console.log(text)}
      />

      {renderIOComes()}
    </div>
  )
}