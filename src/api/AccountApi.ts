import { BaseApi } from "./BaseApi";
import { SuccessCB, FailCB } from "server"
import { RegisterForm } from 'pages/user/UIRegister';
import { RegisterClanForm } from "pages/user/UIRegisterClan";

export class AccountApi extends BaseApi {

  public static register(registerForm: RegisterForm, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      ...registerForm
    });
    return this.server.POST("register", header, body, successCB, failCB);
  }

  public static registerClan(registerForm: RegisterClanForm, successCB: SuccessCB, failCB?: FailCB) {
    const header = this.initHeader();
    const body = this.initBody({
      ...registerForm
    });
    return this.server.POST("register/clan", header, body, successCB, failCB);
  }
}