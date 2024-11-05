import React from "react";

import { t } from "i18next";
import { List, useNavigate } from "zmp-ui";

import { CommonComponentUtils } from "../../utils/CommonComponentUtils";
import { PhoneNumberContext } from "../../pages/main";
import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";

export function UIFund() {
  let navigate = useNavigate();
  const phoneNumber = React.useContext(PhoneNumberContext);
  const [data, setData] = React.useState<any[]>([]);
  const [fetchError, setFetchError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [reload, setReload] = React.useState(false);

  React.useEffect(() => {
    const success = (result: any[]) => {
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
          title=""
        />
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