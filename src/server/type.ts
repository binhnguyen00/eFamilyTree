/** 
 * @description callback for odoo server
 */
export type SuccessCB = (response: ServerResponse) => void;

/** 
 * @description callback for odoo server
 */
export type FailCB = (response: FailResponse) => void;

/** 
 * @description callback for external server
 */
export type CallBack = (response: any) => void;             

export interface FailResponse {
  status: "success" | "error";
  message: string;
  stackTrace: string;
}

export interface ServerResponse {
  status: "success" | "error";
  message: string;
  data: any;
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}