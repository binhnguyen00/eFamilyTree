import React from "react";

import { BaseApi } from "api";
import { useAppContext } from "hooks";

import { Module } from "types/app-context";
import { ServerResponse } from "types/server";
import { PageContext, Capability } from "types/page-context";

export function usePageContext(module: Module) {
  const { userInfo }  = useAppContext();

  const [ context, setContext ] = React.useState<any>({
    module: module,
    capability: Capability.READ
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
            module:     permission.module,
            capability: permission.capability
          });
        }
      }
    });
  }, [ module ])

  return {
    module:       context.module,
    capability:   context.capability,
    canRead:      canRead(context),
    canWrite:     canWrite(context),
    canModerate:  canModerate(context),
    canAdmin:     canAdmin(context)
  } as PageContext;
}

function analyzePerms(ctx: PageContext): Capability[] {
  switch (ctx.capability) {
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

function canRead(ctx: PageContext) {
  const perms = analyzePerms(ctx);
  return perms.includes(Capability.READ);
}

function canWrite(ctx: PageContext) {
  const perms = analyzePerms(ctx);
  return perms.includes(Capability.WRITE);
}

function canModerate(ctx: PageContext) {
  const perms = analyzePerms(ctx);
  return perms.includes(Capability.MODERATOR);
}

function canAdmin(ctx: PageContext) {
  const perms = analyzePerms(ctx);
  return perms.includes(Capability.ADMIN);
}