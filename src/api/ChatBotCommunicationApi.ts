import { SuccessCB, FailCB } from "types/server"
import { BaseApi } from "./BaseApi";

export class ChatBotCommunicationApi extends BaseApi {
  
  public static anonymousTalk({ message, success, fail }: {
    message: any, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      // TODO
    })
    return this.server.POST("", header, body, success, fail);
  }

  public static talk({ message, success, fail }: {
    message: any, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      // TODO
    })
    return this.server.POST("", header, body, success, fail);
  }
}