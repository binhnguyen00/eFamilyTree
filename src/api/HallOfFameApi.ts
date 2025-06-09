import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "types"

import { HallOfFameUser } from "pages/hall-of-fame/UIHallOfFameUser";
import { CreateHallOfFameForm } from "pages/hall-of-fame/types";

export class HallOfFameApi extends BaseApi {

  public static searchMembers({ userId, clanId, typeId, success, fail }: {
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

  public static getHallOfFameUserInfo({ userId, clanId, id, typeId, success, fail }: {
    userId: number, clanId: number, id: number, typeId: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      id: id,
      type_id: typeId,
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

  public static addUserToHallOfFame({ userId, clanId, form, success, fail }: {
    userId: number, clanId: number, form: CreateHallOfFameForm, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      member: {
        member_id: form.memberId,
        type_id: form.typeId,
        recognition_date: form.recognitionDate,
        achievement: form.achievement
      }
    });
    return this.server.POST("hall-of-fame/users/add", header, body, success, fail);
  }

  public static saveUserToHallOfFame({ userId, clanId, form, success, fail }: {
    userId: number, clanId: number, form: HallOfFameUser, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      member: {
        id: form.id,
        member_id: form.memberId,
        type_id: form.typeId,
        recognition_date: form.recognitionDate,
        achievement: form.achievement
      }
    });
    return this.server.POST("hall-of-fame/users/save", header, body, success, fail);
  }

  public static removeUserFromHallOfFame({ userId, clanId, memberId, typeId, success, fail }: {
    userId: number, clanId: number, memberId: number, typeId: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      member_id: memberId,
      type_id: typeId,
    });
    return this.server.POST("hall-of-fame/users/remove", header, body, success, fail);
  }
}