import { Capability } from "./Capability";

import { Module } from "types/app-context";

/**
 * PageContext or on the other hand is Module Context by User
 */
export type PageContext = {
  module: Module;
  accessRight: Capability;
  canRead: boolean;
  canWrite: boolean;
  canModerate: boolean;
  canAdmin: boolean;
}