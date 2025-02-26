import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "types/server"

export class HallOfFameApi extends BaseApi {

  public static getHallOfFameUsers({ userId, clanId, typeId, success, fail }: {
    userId: number, clanId: number, typeId: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      type_id: typeId
    });
    return this.server.POST("hall-of-fame/users", header, body, success, fail);
  }

  public static getHallOfFameUserInfo({ userId, clanId, id, success, fail }: {
    userId: number, clanId: number, id: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      id: id
    });
    return this.server.POST("hall-of-fame/users/info", header, body, success, fail);
  }

  public static getClanHallOfFame({ userId, clanId, success, fail }: {
    userId: number, clanId: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
    });
    return this.server.POST("hall-of-fame", header, body, success, fail);
  }
}