import React from "react";
import { t } from "i18next";
import { Button } from "zmp-ui";

import { FundApi } from "api";
import { CommonUtils, DivUtils } from "utils";
import { useAppContext, useNotification, usePageContext, useRouteNavigate } from "hooks";
import { Header, Loading, ScrollableDiv, Info, CommonIcon, Retry } from "components";

import { ServerResponse } from "types/server";
import { FundInfo } from "./UIFundInfo";
import { UICreateFund } from "./UICreateFund";

export interface FundLine {
  id: number,
  name: string,
  picId: number,
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
        id              : result.id,
        name            : result.name || "",
        balance         : result.balance || 0,
        incomes         : result.incomes || [],
        expenses        : result.expenses || [],
        totalIncomes    : result.total_incomes || 0,
        totalExpenses   : result.total_expenses || 0,
        qrCode: {
          accountOwner    : result.account_holder || "",
          accountOwnerId  : result.account_holder_id || 0,
          accountNumber   : result.account_number || "",
          bankName        : result.bank_name || "",
          imageQR         : result.account_qr || "",
        },
      }
    })
    return results;
  }

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setFunds([] as any);

    FundApi.searchFunds({
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

  const [ create, setCreate ] = React.useState(false);

  const renderCreateFund = () => (
    <>
      <div className="flex-h" style={{ position: "fixed", bottom: 20, right: 10 }}>
        <Button size="small" prefixIcon={<CommonIcon.Plus size={"1rem"}/>} onClick={() => setCreate(true)}>
          {t("tạo quỹ")}
        </Button>
      </div>
      <UICreateFund 
        reloadParent={refresh}
        visible={create} onClose={() => setCreate(false)}
      />
    </>
  )

  const renderContainer = () => {
    if (loading) {
      return <Loading/>
    } else if (error) {
      return <Retry title={t("Chưa có dữ liệu")} onClick={() => refresh()} extra={renderCreateFund()}/>
    } else if (!funds.length) {
      return <Retry title={t("Chưa có dữ liệu")} onClick={() => refresh()} extra={renderCreateFund()}/>
    } else {
      return (
        <div>
          <UIFundList funds={funds}/>
          {renderCreateFund()}
        </div>
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
  const { permissions } = usePageContext();
  const { loadingToast } = useNotification();

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
                  permissions: permissions,
                  fund: {
                    id:             data.id,
                    name:           data.name,
                    balance:        data.balance,
                    incomes:        data.incomes,
                    expenses:       data.expenses,
                    totalIncomes:   data.total_incomes,
                    totalExpenses:  data.total_expenses,
                    qrCode: {
                      accountOwnerId: data.account_holder_id || 0,
                      accountOwner:   data.account_holder || "",
                      accountNumber:  data.account_number || "",
                      bankName:       data.bank_name || "",
                      imageQR:        data.account_qr || "",
                    }
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
      return (
        <div key={`fund-${index}`} className="my-2 button" onClick={() => onSelect(item.id)}>
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
                <div className="bold text-primary">{`${CommonUtils.numberToMonetary(item.balance)} đ`}</div>
              </div>
              <div className="flex-h">
                <div className="text-right">
                  <div className="text-gray-500 text-sm">{t("incomes")}</div>
                  <div className="text-success text-xs">{`${CommonUtils.numberToMonetary(item.balance)} đ`}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500 text-sm">{t("expenses")}</div>
                  <div className="text-danger text-xs">{`${CommonUtils.numberToMonetary(item.totalExpenses)} đ`}</div>
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
      height={DivUtils.calculateHeight(10)}
    >
      {lines}
      <br />
    </ScrollableDiv>
  )
}
