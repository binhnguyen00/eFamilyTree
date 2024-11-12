import React from "react";
import { IoIosArrowForward } from "react-icons/io";

import { t } from "i18next";
import { phoneState } from "states";
import { useRecoilValue } from "recoil";
import { List, Text, useNavigate } from "zmp-ui";

import { CommonComponentUtils } from "components/common/CommonComponentUtils";
import { EFamilyTreeApi } from "utils/EFamilyTreeApi";
import { FailResponse } from "utils/Interface";

import UISearchBar from "components/common/UISearchBar";
import UIHeader from "components/common/UIHeader";

function UIFund() {
  const navigate = useNavigate();
  const phoneNumber = useRecoilValue(phoneState);

  const [ funds, setFunds ] = React.useState<any[]>([]);
  const [ reload, setReload ] = React.useState(false);
  const [ fetchError, setFetchError ] = React.useState(false);

  React.useEffect(() => {
    const success = (result: any[] | string) => {
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
      if (typeof result === "string") {
        setFetchError(true);
        console.warn(result);
      } else {
        setFetchError(false);
        setFunds(result["fund_data"] || []);
      }
    };

    const fail = (error: FailResponse) => {
      setFetchError(true);
      console.error(error.stackTrace);
    };

    EFamilyTreeApi.getFunds(phoneNumber, success, fail);
  }, [ reload ]);

  const navigateToFundDetail = (fund: any = null) => {
    if (!fund) return;
    navigate("/fund-detail", { state: { fund } });
  }

  const renderFundList = () => {
    let html = [] as React.ReactNode[];

    funds.map((item, index) => {
      html.push(
        <List.Item
          key={index}
          suffix={<IoIosArrowForward size={12}/>}
          onClick={() => navigateToFundDetail(item)}
        >
          <>
            <Text.Title> {item["name"]} </Text.Title>
            <Text> {item["total_amount"]} </Text>
          </>
        </List.Item>
      )
    })

    return (
      <List>
        <>{html}</>
      </List>
    )
  }

  const renderFundContainer = () => {
    if (funds.length > 0) {
      return (
        <>
          <UISearchBar 
            placeholder={t("search_funds")}
            onSearch={(text, event) => console.log(text)}
          />
          {renderFundList()}
        </>
      )
    } else {
      if (fetchError) {
        return CommonComponentUtils.renderError(t("server_error"), () => setReload(!reload));
      } else {
        return CommonComponentUtils.renderLoading(t("loading_funds"));
      }
    }
  }

  return (
    <div className="container">
      <UIHeader title={t("funds")}/>

      {renderFundContainer()}
    </div>
  )
}

export default UIFund;