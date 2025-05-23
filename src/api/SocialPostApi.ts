import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "types/server"
import { SocialPostType } from "pages/social-post/UISocialPosts";

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
    return this.server.POST("social/posts", header, body, successCB, failCB);
  }

  public static savePost({ userId, clanId, post, successCB, failCB }: {
    userId: number, 
    clanId: number,
    post: {
      id?: number,
      title: string,
      content: string,
      type: SocialPostType,
    },
    successCB: SuccessCB,
    failCB?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      post: post
    });
    return this.server.POST("post/save", header, body, successCB, failCB);
  }
}