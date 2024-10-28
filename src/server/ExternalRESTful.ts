import { Api } from "./Api";
import { Callback, HttpMethod } from "../utils/Interface";

export class ExternalRESTful extends Api {

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
      body: body,
    }

    return requestInit;
  }

  /** @override */
  doFetch(url: string, requestInit: RequestInit, successCB: Callback, failCB?: Callback) {
    if (!failCB) failCB = (response: any) => {
      console.log(response);
    }

    fetch(url, requestInit).then((res: Response) => {
      if (res.ok) return res.json();
      else return null;
    }).then((res: any) => {
      if (res) successCB(res);
      else failCB(res);
    }).catch((error: Error) => {
      console.log(`Mini App UI error: \n${error}`);
    });
  }

  public GET(path: string, header: any, pathVariables: any, successCB: Callback, failCB?: Callback) {
    var url: string = this.initialUrl(path, pathVariables);
    var requestInit: RequestInit = this.initRequest(HttpMethod.GET, header);
    this.doFetch(url, requestInit, successCB, failCB);
  }

  public POST(path: string, header: any, body: any, successCB: Callback, failCB?: Callback) {
    var url: string = this.initialUrl(path);
    var requestInit: RequestInit = this.initRequest(HttpMethod.POST, header, body);
    this.doFetch(url, requestInit, successCB, failCB);
  }
}