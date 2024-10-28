import { ExternalRESTful } from "server/ExternalRESTful";
import { Callback } from "./Interface";

export class EFamilyTreeApi {
  private static server = new ExternalRESTful("https://giapha.mobifone5.vn");

  public static getMembers(phoneNumber: string, successCB: Callback, failCB?: Callback) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber
    });
    const success = (response: any) => {
      let result = this.getResponseResult(response);
      successCB(result);
    }
    const fail = (response: any) => {
      if (!failCB) failCB = (response: any) => {
        console.log(response);
      }
      let result = this.getResponseResult(response);
      failCB(result);
    }
    this.server.POST("get/member", header, body, success, fail);
  }

  private static initBody(params: any): Record<string, any> { 
    return {
      params: params
    }
  }

  private static initHeader(): Record<string, any> {
    return {
      "Content-Type": "application/json; charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type"
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
    if (response.result.error) {
      return response.result.error;
    } 
    return response.result as any;
  }
}