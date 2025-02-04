import { SuccessCB, FailCB } from "types/server"

import { BaseApi } from "./BaseApi";

export class MemorialMapApi extends BaseApi {

  public static search(params: {
    clan_id: number;
  }, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody(params);
    this.server.POST("memorial/location/search", header, body, successCB, failCB);
  }

  public static create(record: {
    name: string,
    description: string,
    lat: string,
    lng: string,
    images: string[],
    clanId: number,
    memberId?: number,
  }, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      location: {
        name: record.name,
        description: record.description,
        lat: record.lat,
        lng: record.lng,
        images: record.images,
        clan_id: record.clanId,
        member_id: record.memberId!,
      }
    });
    this.server.POST("memorial/location/create", header, body, successCB, failCB);
  }

  public static save(record: {
    name: string,
    description: string,
    lat: string,
    lng: string,
    images: string[],
    clanId: number,
    memberId?: number,
  }, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      location: {
        name: record.name,
        description: record.description,
        lat: record.lat,
        lng: record.lng,
        images: record.images,
        clan_id: record.clanId,
        member_id: record.memberId!,
      }
    });
    this.server.POST("memorial/location/save", header, body, successCB, failCB);
  }

  public static get(userId: number, clanId: number, targetId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      id: targetId,
    })
    this.server.POST("memorial/location/get", header, body, successCB, failCB);
  }

  public static delete(userId: number, clanId: number, targetId: number, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      id: targetId,
    })
    this.server.POST("memorial/location/delete", header, body, successCB, failCB);
  }
}