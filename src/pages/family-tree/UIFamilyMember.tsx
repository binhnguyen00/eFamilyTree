import React from "react";
import { t } from "i18next";
import { Button, Input, Stack, Text } from "zmp-ui";

import { FailResponse } from "utils/Interface";
import { EFamilyTreeApi } from "utils/EFamilyTreeApi";
import { CommonComponentUtils } from "components/common/CommonComponentUtils";

interface UIFamilyMemberProps {
  memberId: number | string;
  phoneNumber?: string | boolean;
}
export function UIFamilyMember(props: UIFamilyMemberProps) {
  const { memberId, phoneNumber } = props;

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

  if (info) {
    return (
      <div>
        <Input label={"Họ Tên"} value={info["name"] || ""} />
        <Input label={"Điện thoại"} value={info["phone"] || ""} />
        <Input label={"Bố"} value={info["bo"] || ""} />
        <Input label={"Mẹ"} value={info["me"] || ""} />
        <Input label={"Ngành/Chi"} value={info["nganh_chi"] || ""} />
      </div>
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