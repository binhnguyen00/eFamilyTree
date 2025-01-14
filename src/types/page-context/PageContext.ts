import { Permission } from "./Permission";

import { Module } from "types/app-context";

/**
 * PageContext or on the other hand is Module Context by User
 */
export type PageContext = {
  module: Module;
  accessRight: Permission;
  canRead: boolean;
  canWrite: boolean;
  canModerate: boolean;
  canAdmin: boolean;
}