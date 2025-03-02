import React from "react";
import { t } from "i18next";
import { Button, Grid } from "zmp-ui";

import { StyleUtils } from "utils";
import { useRouteNavigate } from "hooks";
import { Card, Header, Loading, ScrollableDiv } from "components";

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
      jumpTo({path: "dev/funds/detail", belongings: { fundId: fundId, name: "test" }});
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
      <ScrollableDiv direction="horizontal">
        <div className="flex-h">
          <Button variant="secondary"> Create </Button>
          <Button variant="secondary"> Edit </Button>
          <Button variant="secondary"> Delete </Button>
        </div>
      </ScrollableDiv>
      <ScrollableDiv direction="vertical" height={StyleUtils.calComponentRemainingHeight(85)} className="mt-2">
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
      height={150}
      title={info.name}
      content={(
        <p style={{ fontSize: "1.2rem" }}> {info["balance"]} </p>
      )}
      onClick={onClick}
      className="button bg-secondary text-primary"
    />  
  )
}