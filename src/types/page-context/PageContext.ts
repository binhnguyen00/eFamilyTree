import { Module } from "types/app-context";

/**
 * PageContext or on the other hand is Module Context by User
 */
export type PageContext = {
  module      : Module;
  permissions : PagePermissions;
}

export type PagePermissions = {
  canRead     : boolean;
  canWrite    : boolean;
  canModerate : boolean;
  canAdmin    : boolean;
};

export interface PageContextProps {
  module: Module;
  permissions: PagePermissions;
}

export enum Capability {
  READ = "read",
  WRITE = "write",
  MODERATOR = "moderator",
  ADMIN = "admin",
}