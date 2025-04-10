import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "types/server"

export class FundApi extends BaseApi {
  
  public static getFunds({ clanId, userId, success, fail }: {
    userId: number, clanId: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId
    });
    return this.server.POST("/funds", header, body, success, fail);
  }

  public static getFundById({ userId, clanId, id, success, fail }: {
    userId: number, clanId: number, id: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      id: id,
      user_id: userId,
      clan_id: clanId,
    });
    return this.server.POST("/fund/info", header, body, success, fail);
  }

  public static saveFundQrCode({ id, qrCode, userId, clanId, success, fail }: {
    id: number, qrCode: string, userId: number, clanId: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      id:      id,
      qr_code: qrCode, // as base64
      user_id: userId,
      clan_id: clanId,
    });
    return this.server.POST("/fund/info/qr/save", header, body, success, fail);
  }
}