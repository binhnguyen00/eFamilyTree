import { OdooRESTful, FailCB, SuccessCB } from "server";

export class BaseServer {
  public static server = new OdooRESTful("https://giapha.mobifone5.vn");
  // public static server = new OdooRESTful("http://localhost:8069");

  public static getServerBaseUrl() {
    return this.server.serverUrl;
  }

  public static mockHTTP(successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    return this.server.GET("api/http/mock/setting/default", header, null, successCB, failCB);
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