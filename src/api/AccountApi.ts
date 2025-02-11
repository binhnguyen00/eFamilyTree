import { RegisterForm } from 'pages/user/UIRegister';
import { RegisterClanForm } from "pages/user/UIRegisterClan";

import { SuccessCB, FailCB } from "types/server"

import { BaseApi } from "./BaseApi";

export class AccountApi extends BaseApi {

  public static register(registerForm: RegisterForm, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody(registerForm);
    return this.server.POST("register/account", header, body, successCB, failCB);
  }

  public static registerClan(registerForm: RegisterClanForm, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody(registerForm);
    return this.server.POST("register/clan", header, body, successCB, failCB);
  }
}