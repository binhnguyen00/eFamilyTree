import React from "react";
import { t } from "i18next";
import { Button, Input, Stack, Text } from "zmp-ui";

import { FailResponse } from "utils/Interface";
import { EFamilyTreeApi } from "utils/EFamilyTreeApi";
import { CommonComponentUtils } from "utils/CommonComponentUtils";

interface UIFamilyMemberProps {
  memberId: number | string;
  phoneNumber?: string | boolean;
}
export function UIFamilyMember(props: UIFamilyMemberProps) {
  const { memberId, phoneNumber } = props;
  const [ info, setInfo ] = React.useState<any>(null)
  const [ reload, setReload ] = React.useState(false);
  const [ fetchError, setFetchError ] = React.useState(false);

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

  if (info) {
    return (
      <div>
        <Input label={"Name"} value={info["name"] || ""} />
        <Input label={"Phone"} value={info["phone"] || ""} />
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