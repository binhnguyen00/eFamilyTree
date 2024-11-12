import React from "react";
import { useLocation } from 'react-router-dom';

import { t } from "i18next";
import { Box, List, Text } from "zmp-ui";

import { DateTimeUtils } from "utils/DateTimeUtils";

import UISearchBar from "components/common/UISearchBar";
import UIHeader from "components/common/UIHeader";

export default function UIFundDetail() {
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
    console.log(flow);
    
    let html = [] as React.ReactNode[];
    if (flow.length === 0) return html;

    flow.map((item, index) => {
      const isIncome = item["type"] === "income";
      html.push(
        <List.Item
          key={index}
        >
          <>
            <Box flex flexDirection="row" justifyContent="space-between">
              <Text style={{ color: isIncome ? "green" : "red" }}> 
                {`${isIncome ? "+" : "-"} ${item["amount"]}`} 
              </Text>
              <Text> {item["date"]} </Text>
            </Box>
            <Text> {item["note"] || t("undefinded")} </Text>
          </>
        </List.Item>
      )
    })

    return (
      <List>
        {html}
      </List>
    )
  }

  return (
    <div className="container">
      <UIHeader title={fund.name}/>

      <UISearchBar 
        placeholder={t("search_funds")}
        onSearch={(text, event) => console.log(text)}
      />

      {renderIOComes()}
    </div>
  )
}