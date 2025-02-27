import React from "react";

import { BaseApi } from "api";
import { CommonUtils } from "utils";

import { ServerResponse } from "types/server";
import { UserInfo } from "types/app-context";

export function useClanMemberInfo(phoneNumber: string) {
  let [ info, setInfo ] = React.useState<UserInfo>({
    id: 0,
    name: "unknown",
    clanId: 0,
    clanName: "",
    generation: 0,
  })
  let [ modules, setModules ] = React.useState<string[]>([]);

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
            clanName: info["clan_name"],
            generation: info["generation"]
          } as UserInfo);
          setModules(data.modules);
        } else {
          console.warn(result.message);
        }
      }
      BaseApi.getUserAppContext(phoneNumber, success);
    }
  }, [phoneNumber])

  return {
    userInfo: info,
    modules: modules
  };
}