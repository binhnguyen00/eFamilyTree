import React from "react";
import { t } from "i18next";
import { Box, Text } from "zmp-ui";

import { FundApi } from "api";
import { FailResponse, ServerResponse } from "server";
import { Header, Loading, SearchBar, CommonIcon, AppContext, Info } from "components";
import { useRouteNavigate } from "hooks";

export function UIFund() {
  const { goTo } = useRouteNavigate();
  const { phoneNumber } = React.useContext(AppContext);
  const [ funds, setFunds ] = React.useState<any[]>([]);
  const [ reload, setReload ] = React.useState(false);
  const [ loading, setLoading ] = React.useState(true);

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      setLoading(false);
      if (result.status === "error") {
        console.error("UIFund:\n\t", result.message);
      } else {
        const data = result.data as any[];
        setFunds(data);
      }
    };
    const fail = (error: FailResponse) => {
      setLoading(false);
      console.error("UIFund:\n\t", error.stackTrace);
    };
    FundApi.getFunds(phoneNumber, success, fail);
  }, [ reload ]);

  const navigateToFundDetail = (fund: any = null) => {
    if (!fund) return;
    goTo("funds/detail", { fund });
  }

  const renderFundList = () => {
    let html = [] as React.ReactNode[];

    funds.map((item, index) => {
      const totalAmount = Number.parseFloat(item["total_amount"]);
      const formatted = new Intl.NumberFormat('id-ID').format(totalAmount)
      html.push(
        <Box
          onClick={() => navigateToFundDetail(item)}
          flex flexDirection="row" justifyContent="space-between"
          className="bg-secondary text-primary p-3 rounded mt-2"
        >
          <div>
            <Text.Title> {item["name"]} </Text.Title>
            <Text> {formatted} </Text>
          </div>
          <CommonIcon.ChevonRight size={20}/>
        </Box>
      )
    })

    return (
      <div className="flex-v">
        {html}
      </div>
    )
  }

  const renderFundContainer = () => {
    if (funds.length > 0) {
      return (
        <>
          <SearchBar 
            placeholder={t("search_funds")}
            onSearch={(text, event) => console.log(text)}
          />
          {renderFundList()}
        </>
      )
    } else {
      if (loading) {
        return <Loading message={t("loading_funds")}/>; 
      } else {
        return <Info title={t("no_funds")}/>
      }
    }
  }

  return (
    <div className="container">
      <Header title={t("funds")}/>

      {renderFundContainer()}
    </div>
  )
}