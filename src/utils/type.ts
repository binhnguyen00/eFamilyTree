export type Callback = (response: any) => void; 

export interface FailResponse {
  error: boolean;
  message: string;
  stackTrace: string;
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}