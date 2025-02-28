import React from "react";
import { t } from "i18next";
import { Button, List } from "zmp-ui";

import { FundApi } from "api";
import { StyleUtils } from "utils";
import { useAppContext, useNotification, useRouteNavigate } from "hooks";
import { Header, Loading, ScrollableDiv, Info, CommonIcon } from "components";

import { ServerResponse } from "types/server";

interface FundLine {
  name: string,
  amount: string,
  date: string,
  note: string,
}

export interface Fund {
  id: number,
  name: string,
  balance: string,
  incomes: FundLine[],
  expenses: FundLine[],
}

function useFunds() {
  const { userInfo } = useAppContext();

  const [ funds, setFunds ] = React.useState<Fund[]>([]);
  const [ loading, setLoading ] = React.useState(true);
  const [ error, setError ] = React.useState(false);
  const [ reload, setReload ] = React.useState(false);

  const refresh = () => setReload(!reload);

  const map = (data: any[]) => {
    const results: Fund[] = data.map((result: any) => {
      return {
        id:       result.id,
        name:     result.name,
        balance:  result.balance,
        incomes:  result.incomes,
        expenses: result.expenses
      }
    })
    return results;
  }

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setFunds([] as any);

    FundApi.getFunds({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      success: (result: ServerResponse) => {
        setLoading(false);
        if (result.status === "error") {
          setError(true);
        } else {
          const data = result.data as any[];
          const results = map(data);
          setFunds(results);
        }
      },
      fail: () => {
        setLoading(false);
        setError(true);
      }
    });
  }, [ reload ]);

  return { funds, loading, error, refresh }
}

export function UIFund() {
  const { funds, loading, error, refresh } = useFunds();

  const renderErrorContainer = () => {
    return (
      <div className="flex-v">
        <Info title={t("Chưa có dữ liệu")}/>
        <div className="center">
          <Button size="small" prefixIcon={<CommonIcon.Reload size={"1rem"}/>} onClick={() => refresh()}>
            {t("retry")}
          </Button>
        </div>
      </div>
    )
  }

  const renderContainer = () => {
    if (loading) {
      return (
        <div className="max-h">
          <Loading/>
        </div>
      )
    } else if (error) {
      return renderErrorContainer()
    } else if (!funds.length) {
      return renderErrorContainer()
    } else {
      return (
        <UIFundList funds={funds}/>
      )
    }
  }

  return (
    <>
      <Header title={t("funds")}/>

      <div className="container max-h bg-white text-base">
        {renderContainer()}
      </div>
    </>
  )
}

interface UIFundListProps {
  funds: Fund[];
}
function UIFundList(props: UIFundListProps) {
  const { funds } = props;
  const { goTo } = useRouteNavigate();
  const { userInfo } = useAppContext();
  const { loadingToast } = useNotification();

  const [ fund, setFund ] = React.useState<Fund | null>(null);

  const goToFundInfo = () => {
    if (fund === null) return;
    else {
      goTo({  
        path: "fund/info", 
        data: { 
          fund: fund 
        }
      });
    }
  }

  const onSelect = (id: number) => {
    loadingToast(
      <p> {t("đang tải dữ liệu...")} </p>,
      (successToastCB, dangerToastCB) => {
        FundApi.getFundById({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          id: id,
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToastCB(t("vui lòng thử lại"));
            } else {
              successToastCB(t("lấy dữ liệu thành công"))
              const data = result.data as any;
              setFund({
                id:       data.id,
                name:     data.name,
                balance:  data.balance,
                incomes:  data.incomes,
                expenses: data.expenses
              })
              goToFundInfo();
            }
          },
          fail: () => dangerToastCB(t("vui lòng thử lại"))
        })
      }
    );
  }

  const lines: React.ReactNode[] = React.useMemo(() => {
    return funds.map((item, index) => {
      return (
        <List.Item
          key={`fund-${index}`}
          title={item.name}
          subTitle={item.balance}
          onClick={() => onSelect(item.id)}
          style={{
            fontSize: "1.2rem"
          }}
          suffix={<CommonIcon.ChevonRight size={"1rem"}/>}

        />
      )
    })
  }, [ funds ])

  return (
    <ScrollableDiv height={StyleUtils.calComponentRemainingHeight(0)}>
      <List>
        {lines}
      </List>
    </ScrollableDiv>
  )
}