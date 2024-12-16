import { Api } from "./Api";
import { SuccessCB, FailCB, FailResponse, HttpMethod } from "utils/type";

export class OdooRESTful extends Api {

  /** @override */
  initRequest(method: HttpMethod, requestHeaders?: any, requestBody?: any): RequestInit {;

    let headers: any = null;
    if (requestHeaders) {
      if (requestHeaders['Content-Type']) headers = requestHeaders;
      else {
        headers = {
          'Content-Type': 'application/json; charset=UTF-8',
          ...requestHeaders
        }
        
      }
    } else headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    }

    let body: any = null;
    if (requestBody) body = JSON.stringify(requestBody);

    let requestInit: RequestInit = {
      method: method,
      headers: headers,
      mode: 'cors',
      cache: 'no-cache',
      // credentials: 'include',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: body,
    }

    return requestInit;
  }

  /** @override */
  doFetch(url: string, requestInit: RequestInit, successCB: SuccessCB, failCB?: FailCB) {
    if (!failCB) failCB = (response: any) => {
      console.log(response);
    }

    fetch(url, requestInit).then((res: Response) => {
      if (res.ok) return res.json();
      else return null;
    }).then((res: any) => {
      const result = OdooRESTful.getResponseResult(res);
      successCB(result);
    }).catch((error: Error) => {
      console.error(`eFamilyTree UI error: \n\t${error.message}`);
      failCB({
        status: "error",
        message: error.message,
        stackTrace: error.stack || ""
      } as FailResponse);
    });
  }

  /**  
   * @description Odoo Server always response 200 or not response at all.
   * @odoo_response 
   * {
   *    id: <some_random_long>,
   *    jsonrpc: "2.0",
   *    result: { // custimizable
   *      status: "success" | "error",
   *      message: string, 
   *      data: any
   *    }
   * } 
   * @return the "result" from odoo response
  */
  private static getResponseResult(response: any): any {
    if (response) return response.result;
  }

  public GET(path: string, header: any, pathVariables: any, successCB: SuccessCB, failCB?: FailCB) {
    var url: string = this.initialUrl(path, pathVariables);
    var requestInit: RequestInit = this.initRequest(HttpMethod.GET, header);
    this.doFetch(url, requestInit, successCB, failCB);
  }

  public POST(path: string, header: any, body: any, successCB: SuccessCB, failCB?: FailCB) {
    var url: string = this.initialUrl(path);
    var requestInit: RequestInit = this.initRequest(HttpMethod.POST, header, body);
    this.doFetch(url, requestInit, successCB, failCB);
  }
}