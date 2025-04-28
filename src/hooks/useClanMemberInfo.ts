import React from "react";

import { BaseApi } from "api";
import { CommonUtils } from "utils";

import { ServerResponse } from "types/server";
import { UserInfo } from "types/app-context";

export function useClanMemberInfo(phoneNumber: string) {
  const [ modules, setModules ] = React.useState<Record<string, string>[]>([]);
  const [ userInfo, setUserInfo ] = React.useState<UserInfo>({
    id: 0,
    name: "unknown",
    clanId: 0,
    clanName: "",
    generation: 0,
  })

  React.useEffect(() => {
    if (phoneNumber && !CommonUtils.isStringEmpty(phoneNumber)) {
      const success = (result: ServerResponse) => {
        if (result.status === "success") {
          const data = result.data;
          const info = data.info;
          const modules: Record<string, string>[] = data.modules;
          setUserInfo({
            id:         info.id,
            name:       info.name,
            clanId:     info.clan_id,
            clanName:   info.clan_name,
            generation: info.generation
          } as UserInfo);
          setModules(modules);
        } else {
          console.warn(result.message);
        }
      }
      BaseApi.getUserAppContext(phoneNumber, success);
    }
  }, [phoneNumber])

  return { userInfo, modules };
}