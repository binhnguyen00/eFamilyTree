import React from "react";
import { t } from "i18next";
import { Grid } from "zmp-ui";

import { FundApi } from "api";
import { StyleUtils } from "utils";
import { useAppContext, useRouteNavigate } from "hooks";
import { Header, Loading, SearchBar, ScrollableDiv, Card } from "components";

import { ServerResponse } from "types/server";

export function UIFund() {
  const { funds, loading } = useFunds();

  return (
    <div className="container">
      <Header title={t("funds")}/>

      <UIFundContainer funds={funds} loading={loading}/>
    </div>
  )
}

function useFunds() {
  const { userInfo } = useAppContext();
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
    FundApi.getFunds(userInfo.id, userInfo.clanId, success);
  }, [ reload ]);

  return { 
    loading: loading, funds: funds, reload: reload,
    updateFunds: setFunds, refresh: () => setReload(!reload)
  }
}

// ==========================
// FUND CONTAINER
// ==========================
function UIFundContainer(props: { funds: any[], loading: boolean }) {
  let { funds, loading } = props;
  if (loading) {
    return (
      <div>
        <Header title={t("funds")}/>
        <Loading/>
      </div>
    )
  }
  return <UIFundList funds={funds}/>
}

// ==========================
// FUND LIST
// ==========================
function UIFundList(props: { funds: any[] }) {
  let { funds } = props;
  let { goTo } = useRouteNavigate();

  const navigateToFundDetail = (fund: any) => {
    if (!fund) return;
    else {
      const fundId = fund.id;
      goTo({ 
        path: "fund/info", 
        data: { 
          fundId: fundId 
        }
      });
    }
  }

  let html = [] as React.ReactNode[];
  funds.map((item, index) => {
    html.push(
      <UIFundCard
        info={item}
        onClick={() => navigateToFundDetail(item)}  
      />
    )
  })

  return (
    <div>
      <SearchBar 
        placeholder={t("search_funds")}
        onSearch={(text, event) => console.log(text)}
      />
      <ScrollableDiv height={StyleUtils.calComponentRemainingHeight(85)} width={"auto"}>
        <Grid columnCount={2} columnSpace="10px" rowSpace="10px" >
          {html}
        </Grid>
      </ScrollableDiv>
    </div>
  )
}

// ==========================
// FUND CARD
// ==========================
interface UIFundCardProps {
  info: any,
  onClick?: () => void;
}
function UIFundCard(props: UIFundCardProps) {
  const  { info, onClick } = props;
  return (
    <Card
      // src={info.thumbnail}
      height={"auto"}
      title={info.name}
      content={(
        <p style={{ fontSize: "1.5rem" }}> {info["balance"]} </p>
      )}
      onClick={onClick}
      className="button bg-secondary text-primary"
    />  
  )
}