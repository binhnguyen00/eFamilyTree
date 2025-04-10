import { CreateFundForm } from "pages/fund/UICreateFund";
import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "types/server"
import { FundLine } from "pages/fund/UIFunds";

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

  public static createFund({ fund, userId, clanId, success, fail }: {
    fund: CreateFundForm, userId: number, clanId: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      fund: {
        name:           fund.name,
        account_number: fund.fundQR.accountNumber,
        bank_name:      fund.fundQR.bankName,
        account_qr:     fund.fundQR.imageQR,
      }
    });
    return this.server.POST("/fund/create", header, body, success, fail);
  }

  public static deleteFund({ id, userId, clanId, success, fail }: {
    id: number, userId: number, clanId: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      id:      id,
      user_id: userId,
      clan_id: clanId,
    });
    return this.server.POST("/fund/delete", header, body, success, fail);
  }

  public static addIncome({ userId, clanId, fundId, transaction, success, fail }: {
    userId: number, clanId: number, transaction: FundLine, fundId: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      fund_id: fundId,
      transaction: {
        name:    transaction.name,
        pic_id:  transaction.picId,
        amount:  transaction.amount,
        note:    transaction.note,
        date:    transaction.date,
      }
    });
    return this.server.POST("/fund/info/income/add", header, body, success, fail);
  }

  public static addExpense({ userId, clanId, fundId, transaction, success, fail }: {
    userId: number, clanId: number, transaction: FundLine, fundId: number, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id: userId,
      clan_id: clanId,
      fund_id: fundId,
      transaction: {
        name:    transaction.name,
        pic_id:  transaction.picId,
        amount:  transaction.amount,
        note:    transaction.note,
        date:    transaction.date,
      }
    });
    return this.server.POST("/fund/info/expense/add", header, body, success, fail);
  }

  public static deleteTransaction({ type, id, fundId, userId, clanId, success, fail }: {
    type: "income" | "expense", 
    id: number, 
    fundId: number, 
    userId: number, 
    clanId: number, 
    success: SuccessCB, 
    fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id:  userId,
      clan_id:  clanId,
      id:       id,
      type:     type,
      fund_id:  fundId,
    });
    return this.server.POST("/fund/info/transaction/delete", header, body, success, fail);
  }
}