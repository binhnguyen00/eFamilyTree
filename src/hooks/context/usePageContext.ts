import React from "react";

import { BaseApi } from "api";
import { useAppContext } from "hooks";

import { Module } from "types/app-context";
import { ServerResponse } from "types/server";
import { PageContext, Permission } from "types/page-context";

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
    accessRight: Permission.READ
  });

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      if (result.status === "success") {
        const ctx = result.data;
        setContext({
          module: ctx["module"],
          accessRight: ctx["access_right"]
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
function analyzePerms(ctx: PageContext): Permission[] {
  switch (ctx.accessRight) {
    case Permission.READ:
      return [ Permission.READ ]
    case Permission.WRITE:
      return [ Permission.READ, Permission.WRITE ]
    case Permission.MODERATOR:
      return [ Permission.READ, Permission.WRITE, Permission.MODERATOR ]
    case Permission.ADMIN:
      return [ Permission.READ, Permission.WRITE, Permission.MODERATOR, Permission.ADMIN ]
  }
}

function canRead(ctx: PageContext) {
  const perms = analyzePerms(ctx);
  return perms.includes(Permission.READ);
}

function canWrite(ctx: PageContext) {
  const perms = analyzePerms(ctx);
  return perms.includes(Permission.WRITE);
}

function canModerate(ctx: PageContext) {
  const perms = analyzePerms(ctx);
  return perms.includes(Permission.MODERATOR);
}

function canAdmin(ctx: PageContext) {
  const perms = analyzePerms(ctx);
  return perms.includes(Permission.ADMIN);
}