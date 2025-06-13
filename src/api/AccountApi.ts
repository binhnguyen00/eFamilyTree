import { RegisterForm } from 'pages/user/UIRegister';
import { RegisterClanForm } from "pages/user/UIRegisterClan";

import { SuccessCB, FailCB } from "types"

import { BaseApi } from "./BaseApi";

export class AccountApi extends BaseApi {

  public static register({ registerForm, success, fail }: {
    registerForm: RegisterForm, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      gender: registerForm.gender,
      phone_number: registerForm.mobile,
      clan_code: registerForm.clanCode,
      father_code: registerForm.fatherCode,
      full_name: registerForm.fullName,
      email: registerForm.email
    });
    return this.server.POST("register/account", header, body, success, fail);
  }

  public static registerClan({ registerForm, success, fail }: {
    registerForm: RegisterClanForm, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      clan_name: registerForm.clanName,
      mobile: registerForm.mobile,
      email: registerForm.email,
      subscriber: registerForm.name,
      address: registerForm.address
    });
    return this.server.POST("register/clan", header, body, success, fail);
  }
}