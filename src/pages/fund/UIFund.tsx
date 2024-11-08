import React from "react";
import { useLocation } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";

import { t } from "i18next";
import { phoneState } from "states";
import { useRecoilValue } from "recoil";
import { Box, List, Text, useNavigate } from "zmp-ui";

import { CommonComponentUtils } from "../../components/common/CommonComponentUtils";
import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";
import { DateTimeUtils } from "../../utils/DateTimeUtils";
import { FailResponse } from "../../utils/Interface";

export function UIFund() {
  const navigate = useNavigate();
  const phoneNumber = useRecoilValue(phoneState);

  const [ funds, setFunds ] = React.useState<any[]>([]);
  const [ reload, setReload ] = React.useState(false);
  const [ fetchError, setFetchError ] = React.useState(false);

  React.useEffect(() => {
    const success = (result: any[] | string) => {
      /** Results
       * [{
       *    name: "Quỹ giỗ tổ",
       *    dong_ho: "Nguyễn Văn",
       *    total_amount: 1000000,
       *    income_ids: [
       *      {
       *        id: 6,
       *        nguoi_nop: [
       *          23, "Hoàng Thị Hoa"
       *        ],
       *        amount: 5555.0,
       *        date: "2024-10-29",
       *        note: false
       *      }
       *    ],
       *    expends_ids: [
       *      {
       *        id: 6,
       *        amount: 5555.0,
       *        date: "2024-10-31",
       *        note: false
       *      }
       *    ]
       * }]
       */
      if (typeof result === "string") {
        setFetchError(true);
        console.warn(result);
      } else {
        setFetchError(false);
        setFunds(result["fund_data"] || []);
      }
    };

    const fail = (error: FailResponse) => {
      setFetchError(true);
      console.error(error.stackTrace);
    };

    EFamilyTreeApi.getFunds(phoneNumber, success, fail);
  }, [ reload ]);

  const navigateToFundDetail = (fund: any = null) => {
    if (!fund) return;
    navigate("/fund-detail", { state: { fund } });
  }

  const renderFundList = () => {
    let html = [] as React.ReactNode[];

    funds.map((item, index) => {
      html.push(
        <List.Item
          key={index}
          suffix={<IoIosArrowForward size={12}/>}
          onClick={() => navigateToFundDetail(item)}
        >
          <>
            <Text.Title> {item["name"]} </Text.Title>
            <Text> {item["total_amount"]} </Text>
          </>
        </List.Item>
      )
    })

    return (
      <List>
        <>{html}</>
      </List>
    )
  }

  const renderFundContainer = () => {
    if (funds.length > 0) {
      return (
        <>
          {CommonComponentUtils.renderSearchBar({
            placeholder: t("search_funds"),
            onSearch(text, event) {
              console.log(text);
            },
          })}
          {renderFundList()}
        </>
      )
    } else {
      if (fetchError) {
        return CommonComponentUtils.renderError(t("server_error"), () => setReload(!reload));
      } else {
        return CommonComponentUtils.renderLoading(t("loading_funds"));
      }
    }
  }

  return (
    <div className="container">
      {CommonComponentUtils.renderHeader(t("funds"))}

      {renderFundContainer()}
    </div>
  )
}

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
      {CommonComponentUtils.renderHeader(fund["name"])}

      {CommonComponentUtils.renderSearchBar({
        placeholder: t("search_funds"),
        onSearch(text, event) {
          console.log(text);
        },
      })}

      {renderIOComes()}
    </div>
  )
}