import React from "react";
import { t } from "i18next";
import { Button } from "zmp-ui";

import { FundApi } from "api";
import { StyleUtils } from "utils";
import { useAppContext, useNotification, useRouteNavigate } from "hooks";
import { Header, Loading, ScrollableDiv, Info, CommonIcon } from "components";

import { ServerResponse } from "types/server";
import { FundInfo } from "./UIFundInfo";

import funds from "./data.json";

export interface FundLine {
  name: string,
  amount: number,
  date: string,
  note: string,
}

function useFunds() {
  const { userInfo } = useAppContext();

  const [ funds, setFunds ] = React.useState<FundInfo[]>([]);
  const [ loading, setLoading ] = React.useState(true);
  const [ error, setError ] = React.useState(false);
  const [ reload, setReload ] = React.useState(false);

  const refresh = () => setReload(!reload);

  const map = (data: any[]) => {
    const results: FundInfo[] = data.map((result: any) => {
      return {
        id:             result.id,
        name:           result.name,
        balance:        result.balance,
        incomes:        result.incomes,
        expenses:       result.expenses,
        totalIncomes:   result.total_incomes,
        totalExpenses:  result.total_expenses,
        qrCode: {
          accountOwner:   result.account_holder,
          accountNumber:  result.account_number,
          bankName:       result.bank_name,
          imageQR:        result.account_qr,
        },
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
  const { loading, error, refresh } = useFunds();
  
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
    return (
      <UIFundList funds={funds}/>
    )

    if (loading) {
      return (
        <Loading/>
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

      <div className="container bg-white text-base">
        {renderContainer()}
      </div>
    </>
  )
}

interface UIFundListProps {
  funds: FundInfo[];
}
function UIFundList(props: UIFundListProps) {
  const { funds } = props;
  const { goTo } = useRouteNavigate();
  const { userInfo } = useAppContext();
  const { loadingToast } = useNotification();

  /**@deprecated */
  const onSelectDummy = (id: number) => {
    const data = funds[0];
    goTo({  
      path: "fund/info", 
      belongings: { 
        fund: {
          id:             data.id,
          name:           data.name,
          balance:        data.balance,
          incomes:        data.incomes,
          expenses:       data.expenses,
          qrCode: {
            accountOwner:   data.qrCode.accountOwner,
            accountNumber:  data.qrCode.accountNumber,
            bankName:       data.qrCode.bankName,
            imageQR:        data.qrCode.imageQR,
          },
          totalIncomes:   55000000,
          totalExpenses:  2212353,
        } as FundInfo
      }
    });
  }

  const onSelect = (id: number) => {
    loadingToast({
      content: <p> {t("đang tải dữ liệu...")} </p>,
      operation: (successToastCB, dangerToastCB, dismissToast) => {
        FundApi.getFundById({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          id: id,
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToastCB(t("vui lòng thử lại"));
            } else {
              const data = result.data as any;
              goTo({  
                path: "fund/info", 
                belongings: { 
                  fund: {
                    id:             data.id,
                    name:           data.name,
                    balance:        data.balance,
                    incomes:        data.incomes,
                    expenses:       data.expenses,
                    totalIncomes:   data.total_incomes,
                    totalExpenses:  data.total_expenses,
                  } as FundInfo
                }
              });
              dismissToast();
            }
          },
          fail: () => dangerToastCB(t("vui lòng thử lại"))
        })
      }
    });
  }

  const lines: React.ReactNode[] = React.useMemo(() => {
    return funds.map((item, index) => {
      const totalIncomes = item.incomes.reduce((sum, current) => sum + current.amount, 0);
      const totalExpenses = item.expenses.reduce((sum, current) => sum + current.amount, 0);
      
      return (
        <div key={`fund-${index}`} className="my-2 button" onClick={() => onSelectDummy(item.id)}>
          {/* header */}
          <div className="p-3 bg-primary text-white rounded-top"> 
            <div className="flex-h justify-between">
              <div className="bold text-lg"> {item.name} </div>
              <CommonIcon.ChevonRight size={"1rem"} className="text-white" />
            </div>
          </div>
          {/* body */}  
          <div className="p-3 bg-gray-100 rounded-bottom">
            <div className="flex-h justify-between">
              <div>
                <div>{t("balance")}</div>
                <div className="bold text-primary">{`${item.balance} đ`}</div>
              </div>
              <div className="flex-h">
                <div className="text-right">
                  <div className="text-gray-500 text-sm">{t("incomes")}</div>
                  <div className="text-success text-xs">{`+${totalIncomes} đ`}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500 text-sm">{t("expenses")}</div>
                  <div className="text-danger text-xs">{`-${totalExpenses} đ`}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )
    })
  }, [ funds ])

  return (
    <ScrollableDiv 
      direction="vertical" 
      className="flex-v" 
      height={StyleUtils.calComponentRemainingHeight(10)}
    >
      {lines}
    </ScrollableDiv>
  )
}
