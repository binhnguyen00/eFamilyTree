import React from "react";
import { t } from "i18next";
import { useLocation } from "react-router-dom";
import { Box, Button, Input, Stack, Text } from "zmp-ui";

import { FailResponse } from "utils/Interface";
import { EFamilyTreeApi } from "utils/EFamilyTreeApi";
import { CommonComponentUtils } from "components/common/CommonComponentUtils";

function UIFamilyMember() {
  const location = useLocation();

  const { data } = location.state || null;
  const phoneNumber = data.phoneNumber;
  const memberId = data.memberId;

  const [ info, setInfo ] = React.useState<any>(null)
  const [ reload, setReload ] = React.useState(false);
  const [ fetchError, setFetchError ] = React.useState(false);

  React.useEffect(() => {
    const success = (result: any) => {
      if (result.error) {
        setFetchError(true);
        console.warn(result.error);
      } else {
        setFetchError(false);
        setInfo(result.info || null);
      }
    }

    const fail = (error: FailResponse) => {
      setFetchError(true);
      console.error(error.stackTrace);
    }

    EFamilyTreeApi.getMemberInfo(phoneNumber, memberId as number, success, fail);
  }, [ reload, memberId ])


  const renderContainer = () => {
    if (info) {
      return (
        <Box>
          <Input label={"Họ Tên"} value={info["name"] || ""} />
          <Input label={"Điện thoại"} value={info["phone"] || ""} />
          <Input label={"Bố"} value={info["bo"] || ""} />
          <Input label={"Mẹ"} value={info["me"] || ""} />
          <Input label={"Ngành/Chi"} value={info["nganh_chi"] || ""} />
        </Box>
      )
    } else {
      if (fetchError) {
        return (
          <Stack className="center">
            <Text.Title size="normal"> {t("server_error")} </Text.Title>
            <Button 
              style={{ width: "10%" }}
              size="small" onClick={() => setReload(!reload)}
            > {t("retry")} </Button>
          </Stack>
        )
      } else return CommonComponentUtils.renderLoading(t("loading"));
    }
  }

  return (
    <div className="container">
      {CommonComponentUtils.renderHeader(t("member_info"))}

      {renderContainer()}
    </div>
  )
}

export default UIFamilyMember;