export type SuccessCB = (response: ServerResponse) => void; 
export type FailCB = (response: FailResponse) => void; 

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