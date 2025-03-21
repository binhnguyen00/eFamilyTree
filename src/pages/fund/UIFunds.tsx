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
        <div 
          key={`fund-${index}`}
          className="fund-card mb-3 rounded-lg overflow-hidden shadow-sm"
          onClick={() => onSelect(item.id)}
        >
          <div className="fund-header p-3 bg-primary text-white">
            <div className="flex-h justify-between items-center">
              <div className="font-bold text-lg">{item.name}</div>
              <CommonIcon.ChevonRight size={"1rem"} className="text-white" />
            </div>
          </div>
          <div className="fund-body p-3 bg-white">
            <div className="flex-h justify-between items-center">
              <div>
                <div className="text-gray-500 text-sm">{t("balance")}</div>
                <div className="font-bold text-base">{item.balance} đ</div>
              </div>
              <div className="flex-h gap-4">
                <div className="text-right">
                  <div className="text-gray-500 text-sm">{t("incomes")}</div>
                  <div className="text-success text-xs">+{item.incomes.length > 0 ? item.incomes.reduce((sum, current) => 
                    sum + parseInt(current.amount.replace(/\./g, '')), 0).toLocaleString('vi-VN') : 0} đ</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500 text-sm">{t("expenses")}</div>
                  <div className="text-danger text-xs">-{item.expenses.length > 0 ? item.expenses.reduce((sum, current) => 
                    sum + parseInt(current.amount.replace(/\./g, '')), 0).toLocaleString('vi-VN') : 0} đ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    })
  }, [ funds ])

  return (
    <ScrollableDiv className="text-base p-3" height={StyleUtils.calComponentRemainingHeight(0)}>
      {lines}
      <br/><br/>
    </ScrollableDiv>
  )
}
