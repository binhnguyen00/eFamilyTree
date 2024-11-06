import React from "react";
import { IoIosArrowForward } from "react-icons/io";

import { t } from "i18next";
import { List } from "zmp-ui";

import { CommonComponentUtils } from "../../utils/CommonComponentUtils";
import { PhoneNumberContext } from "../../pages/main";
import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";

export function UIFund() {
  const phoneNumber = React.useContext(PhoneNumberContext);
  const [data, setData] = React.useState<any[]>([]);
  const [fetchError, setFetchError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [reload, setReload] = React.useState(false);

  React.useEffect(() => {
    const success = (result: any[]) => {
      /** Results
       * [{
       *    name: "Quỹ giỗ tổ",
       *    dong_ho: "Nguyễn Văn",
       *    total_amount: 1000000,
       *    income_ids: [
       *      {
       *        id: 6,
       *        nguoi_nop: [
       *          23, "Hoàng Thị Hoa"
       *        ],
       *        amount: 5555.0,
       *        date: "2024-10-29",
       *        note: false
       *      }
       *    ],
       *    expends_ids: [
       *      {
       *        id: 6,
       *        amount: 5555.0,
       *        date: "2024-10-31",
       *        note: false
       *      }
       *    ]
       * }]
       */
      setLoading(false);
      const funds = result["fund_data"];
      setData(funds);
    };

    const fail = (error: any) => {
      setLoading(false);
      setFetchError(true);
    };

    const fetchData = () => {
      setLoading(true);
      setFetchError(false);
      EFamilyTreeApi.getFunds(phoneNumber, success, fail);
    };

    fetchData();
  }, [ reload, phoneNumber ]);

  const renderFunds = () => {
    let html = [] as React.ReactNode[];

    data.map((item, index) => {
      html.push(
        <List.Item
          key={index}
          title={item["total_amount"]}
          subTitle={item["name"]}
          suffix={<IoIosArrowForward size={12}/>}
        ></List.Item>
      )
    })

    return (
      <List>
        <>{html}</>
      </List>
    )
  }

  return (
    <div className="container">
      {CommonComponentUtils.renderHeader(t("funds"))}

      <div className="flex-v">
        {loading ? (
          CommonComponentUtils.renderLoading(t("loading_funds"))
        ) : (
          fetchError ? (
            CommonComponentUtils.renderError(t("server_error"), () => setReload((prev) => !prev))
          ) : data.length > 0 ? (
            renderFunds()
          ) : (
            CommonComponentUtils.renderRetry(t("no_funds"), () => setReload((prev) => !prev))
          )
        )}
      </div>
    </div>
  )
}