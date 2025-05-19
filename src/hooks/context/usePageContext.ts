import React from "react";

import { BaseApi } from "api";
import { useAppContext, useRouteNavigate } from "hooks";
import { ServerResponse, PageContext, Capability, Module } from "types";

function useCurrentModule(): { module: Module } {
  const map: Record<string, Module> = {
    "family-tree"       : Module.FAMILY_TREE,
    "gallery"           : Module.GALLERY,
    "calendar"          : Module.CALENDAR,
    "funds"             : Module.FUND,
    "social-posts"      : Module.SOCIAL_POST,
    "hall-of-fame"      : Module.HALL_OF_FAME,
    "ritual-script"     : Module.RITUAL_SCRIPT,
    "memorial-location" : Module.MEMORIAL_LOCATION,
    "dev"               : Module.PLAYGROUND,
  }
  /* currentPath: /zapps/{appId}/{module}/{subRoute} */
  const { currentPath } = useRouteNavigate();
  const parts: string[] = currentPath.split('/'); // ['', 'zapps', '{appId}', '{module}', '{subRoute}']
  const moduleKey: string = parts[3];
  const module: Module = map[moduleKey];
  return { module };
}

export function usePageContext() {
  const { module } = useCurrentModule();
  const { userInfo }  = useAppContext();

  const [ context, setContext ] = React.useState<any>({
    module      : module,
    capability  : Capability.READ
  });

  React.useEffect(() => {
    BaseApi.getUserPageContext({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      moduleCode: module,
      successCB: (result: ServerResponse) => {
        if (result.status === "success") {
          const permission = result.data.permission;
          setContext({
            module      : permission.module,
            capability  : permission.capability
          });
        }
      }
    });
  }, [ module ])

  return {
    module      : context.module,
    permissions: {
      canRead     : canRead(context.capability),
      canWrite    : canWrite(context.capability),
      canModerate : canModerate(context.capability),
      canAdmin    : canAdmin(context.capability)
    }
  } as PageContext;
}

function canRead(cap: Capability) {
  const perms = analyzePermission(cap);
  return perms.includes(Capability.READ);
}

function canWrite(cap: Capability) {
  const perms = analyzePermission(cap);
  return perms.includes(Capability.WRITE);
}

function canModerate(cap: Capability) {
  const perms = analyzePermission(cap);
  return perms.includes(Capability.MODERATOR);
}

function canAdmin(cap: Capability) {
  const perms = analyzePermission(cap);
  return perms.includes(Capability.ADMIN);
}

function analyzePermission(cap: Capability): Capability[] {
  switch (cap) {
    case Capability.READ:
      return [ Capability.READ ]
    case Capability.WRITE:
      return [ Capability.READ, Capability.WRITE ]
    case Capability.MODERATOR:
      return [ Capability.READ, Capability.WRITE, Capability.MODERATOR ]
    case Capability.ADMIN:
      return [ Capability.READ, Capability.WRITE, Capability.MODERATOR, Capability.ADMIN ]
  }
}