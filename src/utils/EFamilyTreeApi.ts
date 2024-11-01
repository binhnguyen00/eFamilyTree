import { Callback } from "./Interface";
import { ExternalRESTful } from "server/ExternalRESTful";

export class EFamilyTreeApi {
  private static server = new ExternalRESTful("https://giapha.mobifone5.vn");

  public static getServerBaseUrl() {
    return this.server.serverUrl;
  }

  public static getMembers(phoneNumber, successCB: Callback, failCB?: Callback) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber
    });
    const [ success, fail ] = this.createCallback(successCB, failCB);
    this.server.POST("get/member", header, body, success, fail);
  }

  public static getMemberInfo(phoneNumber, memberId: number, successCB: Callback, failCB?: Callback) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber,
      thanh_vien_id: memberId
    });
    const [ success, fail ] = this.createCallback(successCB, failCB);
    return this.server.POST("get/info/member", header, body, success, fail);
  }

  public static getMemberBlogs(phoneNumber, successCB: Callback, failCB?: Callback) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber
    });
    const [ success, fail ] = this.createCallback(successCB, failCB);
    return this.server.POST("get/list/blog", header, body, success, fail);
  }

  public static getMemberAlbum(phoneNumber, successCB: Callback, failCB?: Callback) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber
    });
    const [ success, fail ] = this.createCallback(successCB, failCB);
    return this.server.POST("get/album", header, body, success, fail);
  }

  public static getMemberUpcomingEvents(phoneNumber, successCB: Callback, failCB?: Callback) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber
    });
    const [ success, fail ] = this.createCallback(successCB, failCB);
    return this.server.POST("get/events", header, body, success, fail);
  }

  private static initBody(params: any): Record<string, any> { 
    return {
      params: params
    }
  }

  private static initHeader(): Record<string, any> {
    return {
      "Content-Type": "application/json; charset=UTF-8",
    }
  }

  private static getResponseResult(response: any): any {
    /* Fail Response
    {
      "jsonrpc": "2.0",
      "id": 1297312732103,
      "result": {
        "error": "Bạn không thuộc cây gia phả nào"
      }
    } */
    if (!response) return "No Response from Server!";
    if (response.error) return response;
    if (response.result.error) return response.result;
    return response.result as any;
  }

  private static createCallback(successCB: Callback, failCB?: Callback) {
    const success = (response: any) => {
      const result = this.getResponseResult(response);
      successCB(result);
    }
    const fail = (response: any) => {
      const result = this.getResponseResult(response);
      if (failCB) failCB(result);
    }
    return [ success, fail ];
  }
}