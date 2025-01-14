import React from "react";

import { BaseApi } from "api";
import { useAppContext } from "hooks";

import { Module } from "types/app-context";
import { ServerResponse } from "types/server";
import { PageContext, Capability } from "types/page-context";

export function usePageContext(module: Module) {
  const { userInfo }  = useAppContext();
  const context       = useGetContext(userInfo.id, userInfo.clanId, module);

  return {
    module: context.module,
    accessRight: context.accessRight,
    canRead: canRead(context),
    canWrite: canWrite(context),
    canModerate: canModerate(context),
    canAdmin: canAdmin(context)
  } as PageContext;
}

function useGetContext(userId: number, clanId: number, module: Module) {
  const [ context, setContext ] = React.useState<any>({
    module: "",
    accessRight: Capability.READ
  });

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      if (result.status === "success") {
        const ctx: {
          module: string,
          access_right: Capability
        } = result.data;
        setContext({
          module: ctx.module,
          accessRight: ctx.access_right
        });
      }
    }
    BaseApi.getUserPageContext(userId, clanId, module, success);
  }, [ module ])

  return context;
}

// ====================================
// utilities
// ====================================
function analyzePerms(ctx: PageContext): Capability[] {
  switch (ctx.accessRight) {
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