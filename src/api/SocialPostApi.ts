import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "types/server"
import { SocialPostType } from "pages/social-post/UISocialPost";

export class SocialPostApi extends BaseApi {

  public static getSocialPosts({ type, userId, clanId, successCB, failCB }: {
    type: SocialPostType,
    userId: number,
    clanId: number,
    successCB: SuccessCB,
    failCB?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      post_type: type
    });
    // TODO: change route to social/posts
    return this.server.POST("post/list", header, body, successCB, failCB);
  }
}