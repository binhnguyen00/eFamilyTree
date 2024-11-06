import React from "react";
import { useLocation } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";

import { t } from "i18next";
import { Box, Input, List, Text, useNavigate } from "zmp-ui";

import { CommonComponentUtils } from "../../utils/CommonComponentUtils";
import { PhoneNumberContext } from "../../pages/main";
import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";
import { DateTimeUtils } from "utils/DateTimeUtils";

export function UIFund() {
  const navigate = useNavigate();
  const phoneNumber = React.useContext(PhoneNumberContext);
  const [ funds, setFunds ] = React.useState<any[]>([]);
  const [ fetchError, setFetchError ] = React.useState(false);
  const [ loading, setLoading ] = React.useState(true);
  const [ reload, setReload ] = React.useState(false);

  React.useEffect(() => {
    const success = (result: any[]) => {
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
      setLoading(false);
      const data = result["fund_data"] || [];
      setFunds(data);
    };

    const fail = (error: any) => {
      setLoading(false);
      setFetchError(true);
    };

    const fetchData = () => {
      setLoading(true);
      setFetchError(false);
      EFamilyTreeApi.getFunds(phoneNumber, success, fail);
    };

    fetchData();
  }, [ reload, phoneNumber ]);

  const navigateToFundDetail = (fund: any = null) => {
    if (!fund) return;
    navigate("/fund-detail", { state: { fund } });
  }

  const renderFunds = () => {
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

  return (
    <div className="container">
      {CommonComponentUtils.renderHeader(t("funds"))}

      <div className="flex-v">
        {loading ? (
          CommonComponentUtils.renderLoading(t("loading_funds"))
        ) : (
          fetchError ? (
            CommonComponentUtils.renderError(t("server_error"), () => setReload((prev) => !prev))
          ) : funds.length > 0 ? (
            <>
              <Input.Search placeholder={t("search_funds")}/>
              {renderFunds()}
            </>
          ) : (
            CommonComponentUtils.renderRetry(t("no_funds"), () => setReload((prev) => !prev))
          )
        )}
      </div>
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

      <Input.Search 
        placeholder={t("search_funds")}
      />

      {renderIOComes()}
    </div>
  )
}