import React from "react";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

import { phoneState } from "states";
import { useRecoilValue } from "recoil";

import { Box, Text } from "zmp-ui";

import { EFamilyTreeApi, FailResponse, ServerResponse } from "utils";
import { Header, Loading, Error, SearchBar, CommonIcon } from "components";

export function UIFund() {
  const navigate = useNavigate();
  const phoneNumber = useRecoilValue(phoneState);

  const [ funds, setFunds ] = React.useState<any[]>([]);
  const [ reload, setReload ] = React.useState(false);
  const [ fetchError, setFetchError ] = React.useState(false);

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      if (result.status === "error") {
        console.error("UIFund:\n\t", result.message);
      } else {
        const data = result.data as any[];
        setFunds(data);
      }
    };
    const fail = (error: FailResponse) => {
      console.error("UIFund:\n\t", error.stackTrace);
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
      if (fetchError) {
        return <Error message={t("server_error")} onRetry={() => setReload(!reload)}/>; 
      } else {
        return <Loading message={t("loading_funds")}/>; 
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