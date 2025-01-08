import React from "react";

import { t } from "i18next";
import { Grid } from "zmp-ui";

import { useRouteNavigate } from "hooks";
import { Card, Header, Loading, ScrollableDiv, SearchBar } from "components";

import data from "./sample/funds.json";

export default function UIDummyFund() {
  const { funds, loading } = useFunds();

  return (
    <div className="container">
      <Header title={t("funds")}/>

      <UIFundContainer funds={funds} loading={loading}/>
    </div>
  )
}

function useFunds() {
  const [ funds, setFunds ] = React.useState<any[]>(data);
  const [ reload, setReload ] = React.useState(false);
  const [ loading, setLoading ] = React.useState(false);

  React.useEffect(() => {
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

  let { jumpTo } = useRouteNavigate();
  let html = [] as React.ReactNode[];

  const navigateToFundDetail = (fund: any) => {
    if (!fund) return;
    else {
      const fundId = fund.id;
      jumpTo("dev/funds/detail", { fundId });
    }
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
    <div>
      <SearchBar 
        placeholder={t("search_funds")}
        onSearch={(text, event) => console.log(text)}
      />
      <ScrollableDiv direction="vertical" height={window.innerHeight - 220} className="mt-2">
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

  const totalAmount = Number.parseFloat(info["total"]);
  const formatted = new Intl.NumberFormat('id-ID').format(totalAmount)

  return (
    <Card
      // src={info.thumbnail}
      width={"auto"}
      height={150}
      title={info.name}
      content={(
        <p style={{ fontSize: "1.2rem" }}> {formatted} </p>
      )}
      onClick={onClick}
      className="button"
    />  
  )
}