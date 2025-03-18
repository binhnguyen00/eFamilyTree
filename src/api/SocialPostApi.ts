import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "types/server"

export class SocialPostApi extends BaseApi {

  public static getSocialPosts(userId: number, clanId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      post_type: "news"
    });
    return this.server.POST("get/list/blog", header, body, successCB, failCB);
  }
}