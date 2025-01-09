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

export function useClanMemberContext(phoneNumber: string) {
  let [ info, setInfo ] = React.useState<ClanMemberInfo>({
    id: 0,
    name: "unknown",
    clanId: 0,
    generation: 0
  })
  let [ permissions, setPermissions ] = React.useState([]);

  React.useEffect(() => {
    if (phoneNumber && !CommonUtils.isStringEmpty(phoneNumber)) {
      const success = (result: ServerResponse) => {
        if (result.status === "success") {
          const data = result.data;
          const info = data.info;
          setInfo({
            id: info["id"],
            name: info["name"],
            clanId: info["clan_id"],
            generation: info["generation"]
          } as ClanMemberInfo);
          setPermissions(data.permissions);
        } else {
          console.warn(result.message);
        }
      }
      BaseApi.getClanMemberInfo(phoneNumber, success);
    }
  }, [phoneNumber])

  return {
    userInfo: info,
    userPermissions: permissions
  };
}