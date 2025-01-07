import React from "react";
import { t } from "i18next";

import { FundApi } from "api";
import { useRouteNavigate } from "hooks";
import { FailResponse, ServerResponse } from "server";
import { Header, Loading, SearchBar, AppContext, ScrollableDiv, Card } from "components";
import { Grid } from "zmp-ui";

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
  const { userInfo } = React.useContext(AppContext);
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
    FundApi.getFunds(userInfo.id, userInfo.clanId, success, fail);
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
  return (
    <div>
      <UIFundList funds={funds}/>
    </div>
  )
}

// ==========================
// FUND LIST
// ==========================
function UIFundList(props: { funds: any[] }) {
  let { funds } = props;

  let { goTo } = useRouteNavigate();
  let html = [] as React.ReactNode[];

  const navigateToFundDetail = (fund: any) => {
    if (!fund) return;
    goTo({ path: "funds/detail", data: {fund} });
  }

  funds.map((item, index) => {
    html.push(
      <UIFundCard
        info={item}
        onClick={() => navigateToFundDetail(item)}  
      />
    )
  })

  return (
    <div style={{ height: `${funds.length} ? "auto" : "100%"` }}>
      <SearchBar 
        placeholder={t("search_funds")}
        onSearch={(text, event) => console.log(text)}
      />
      <ScrollableDiv height={"100%"} width={"auto"}>
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

  const totalAmount = Number.parseFloat(info["total_amount"]);
  const formatted = new Intl.NumberFormat('id-ID').format(totalAmount)

  return (
    <Card
      // src={info.thumbnail}
      width={"auto"}
      height={"auto"}
      title={info.name}
      content={(
        <p style={{ fontSize: "1.2rem" }}> {formatted} </p>
      )}
      onClick={onClick}
      className="button"
    />  
  )
}