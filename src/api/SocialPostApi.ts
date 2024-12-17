import { BaseServer } from "./BaseServer";
import { SuccessCB, FailCB } from "server"

export class SocialPostApi extends BaseServer {

  public static getSocialPosts(phoneNumber, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      phone: phoneNumber
    });
    return this.server.POST("get/list/blog", header, body, successCB, failCB);
  }
}