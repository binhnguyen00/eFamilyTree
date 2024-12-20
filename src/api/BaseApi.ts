import { OdooRESTful } from "server";

export class BaseApi {
  public static server = new OdooRESTful("https://giapha.mobifone5.vn");

  public static getServerBaseUrl() {
    return this.server.serverUrl;
  }

  public static initBody(params: any): Record<string, any> { 
    return {
      jsonrpc: "2.0",
      method: "call",
      id: 1,
      params: params
    }
  }

  public static initHeader(): Record<string, any> {
    return {
      'Content-Type': 'application/json; charset=UTF-8',
    }
  }
}