import React from "react";
import { t } from "i18next";
import { Button, List } from "zmp-ui";

import { FundApi } from "api";
import { StyleUtils } from "utils";
import { useAppContext, useNotification, useRouteNavigate } from "hooks";
import { Header, Loading, ScrollableDiv, Info, CommonIcon } from "components";

import { ServerResponse } from "types/server";
import { FundInfo } from "./UIFundInfo";

const funds = [
  {
    "id": 1,
    "name": "Quỹ khuyến học",
    "balance": "200.000.000",
    "incomes": [
      {
        "name": "Phạm Khắc Phú",
        "amount": "5.000.000",
        "date": "12/12/2024",
        "note": ""
      },
      {
        "name": "Phạm Khắc Phú",
        "amount": "5.000.000",
        "date": "12/12/2024",
        "note": ""
      },
      {
        "name": "Phạm Khắc Phú",
        "amount": "5.000.000",
        "date": "12/12/2024",
        "note": ""
      },
      {
        "name": "Phạm Khắc Phú",
        "amount": "5.000.000",
        "date": "12/12/2024",
        "note": ""
      },
      {
        "name": "Phạm Thị Đỏ",
        "amount": "2.000.000",
        "date": "12/12/2024",
        "note": ""
      }
    ],
    "expenses": [
      {
        "name": "Phạm Khắc Thành",
        "amount": "2.000.000",
        "date": "12/12/2024",
        "note": "Chi cho mua le Chi cho mua le Chi cho mua le Chi cho mua le Chi cho mua le"
      },
      {
        "name": "Phạm Khắc Thành",
        "amount": "2.000.000",
        "date": "12/12/2024",
        "note": "Chi cho mua le"
      },
      {
        "name": "Phạm Khắc Thành",
        "amount": "2.000.000",
        "date": "12/12/2024",
        "note": "Chi cho mua le"
      },
      {
        "name": "Phạm Khắc Thành",
        "amount": "2.000.000",
        "date": "12/12/2024",
        "note": "Chi cho mua le"
      },
    ],
    "totalIncomes": "5.000.000",
    "totalExpenses": "2.000.000"
  },
  {
    "id": 2,
    "name": "Quỹ Giỗ tổ",
    "balance": "250.000.000",
    "incomes": [
      {
        "name": "Phạm Thị Hiên",
        "amount": "5.000.000",
        "date": "23/12/2024",
        "note": ""
      }
    ],
    "expenses": [],
    "totalIncomes": "5.000.000",
    "totalExpenses": "0"
  }
]

export interface FundLine {
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
      <div className="flex-v max-h">
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
          totalIncomes:   "55.000.000",
          totalExpenses:  "22.123.53",
        } as FundInfo
      }
    });
  }

  const onSelect = (id: number) => {
    loadingToast(
      <p> {t("đang tải dữ liệu...")} </p>,
      (successToastCB, dangerToastCB, dismissToast) => {
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
    );
  }

  const lines: React.ReactNode[] = React.useMemo(() => {
    return funds.map((item, index) => {
      const totalIncomes = item.incomes.reduce((sum, current) => 
        sum + parseInt(current.amount.replace(/\./g, '')), 0).toLocaleString('vi-VN');
      const totalExpenses = item.expenses.reduce((sum, current) => 
        sum + parseInt(current.amount.replace(/\./g, '')), 0).toLocaleString('vi-VN');

      return (
        <div key={`fund-${index}`} className="mb-3" onClick={() => onSelect(item.id)}>
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
    <ScrollableDiv className="text-base flex-v" height={StyleUtils.calComponentRemainingHeight(0)}>
      {lines}
      <br/><br/>
    </ScrollableDiv>
  )
}
