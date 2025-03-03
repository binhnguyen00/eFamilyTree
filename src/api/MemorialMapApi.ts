import { SuccessCB, FailCB } from "types/server"

import { BaseApi } from "./BaseApi";
import { MemorialLocation } from "pages/memorial-map/UIMap";

export class MemorialMapApi extends BaseApi {

  public static search({ clanId, success, fail }: {
    clanId: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      clan_id: clanId
    });
    this.server.POST("memorial/location/search", header, body, success, fail);
  }

  public static create({ record, success, fail }: {
    record: MemorialLocation, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      location: {
        id: record.id,
        name: record.name,
        description: record.description,
        lat: record.coordinate.lat.toString(),
        lng: record.coordinate.lng.toString(),
        images: record.images,
        clan_id: record.clanId,
        member_id: record.memberId!,
      }
    });
    this.server.POST("memorial/location/create", header, body, success, fail);
  }

  public static save({ record, success, fail }: {
    record: MemorialLocation, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      location: {
        id: record.id,
        name: record.name,
        description: record.description,
        lat: record.coordinate.lat.toString(),
        lng: record.coordinate.lng.toString(),
        images: record.images,
        clan_id: record.clanId,
        member_id: record.memberId!,
      }
    });
    this.server.POST("memorial/location/save", header, body, success, fail);
  }

  public static get({ userId, clanId, id, success, fail }: {
    userId: number, clanId: number, id: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      id: id,
    })
    this.server.POST("memorial/location/get", header, body, success, fail);
  }

  public static delete(params: {
    userId: number, clanId: number, targetId: number
  }, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: params.userId,
      clan_id: params.clanId,
      id: params.targetId,
    })
    this.server.POST("memorial/location/delete", header, body, successCB, failCB);
  }
}