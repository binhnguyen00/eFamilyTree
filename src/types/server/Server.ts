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

export type FailResponse = {
  status: "success" | "error";
  message: string;
  stackTrace: string;
}

export type ServerResponse = {
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