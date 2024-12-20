import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "server"

export class FundApi extends BaseApi {
  
  public static getFunds(phoneNumber, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber
    });
    return this.server.POST("get/fund", header, body, successCB, failCB);
  }
}