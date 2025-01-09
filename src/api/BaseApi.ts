import { FailCB, OdooRESTful, SuccessCB } from "server";

export class BaseApi {
  // public static server = new OdooRESTful("http://localhost:8069");
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

  public static getClanMemberInfo(phoneNumber: string, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone_number: phoneNumber,
    });
    this.server.POST("context/user", header, body, successCB, failCB);
  }
}