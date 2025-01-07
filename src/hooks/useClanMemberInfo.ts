import React from "react";

import { BaseApi } from "api";
import { CommonUtils } from "utils";
import { ServerResponse } from "server";

export interface ClanMemberInfo {
  id: number;
  name: string;
  clanId: number;
  generation: number
}

export function useClanMemberInfo(phoneNumber: string) {
  let [ info, setInfo ] = React.useState<ClanMemberInfo>()

  React.useEffect(() => {
    if (phoneNumber && !CommonUtils.isStringEmpty(phoneNumber)) {
      const success = (result: ServerResponse) => {
        if (result.status === "success") {
          const data = result.data;
          setInfo({
            id: data["id"],
            name: data["name"],
            clanId: data["clan_id"],
            generation: data["generation"]
          } as ClanMemberInfo);
        } else {
          console.warn(result.message);
        }
      }
      BaseApi.getClanMemberInfo(phoneNumber, success);
    }
  }, [phoneNumber])

  return info;
}