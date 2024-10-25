import { Api } from "./Api";
import { Callback, HttpMethod } from "../utils/interface";

export class ExternalRESTful extends Api {

  /** @override */
  initRequest(method: HttpMethod, requestHeader?: any, requestBody?: any): RequestInit {;

    let header: any = null;
    if (requestHeader) {
      if (requestHeader['Content-Type']) header = requestHeader;
      else {
        header = {
          'Content-Type': 'application/json; charset=UTF-8',
          ...requestHeader
        }
      }
    }

    let body: any = null;
    if (requestBody) body = JSON.stringify(requestBody);

    let requestInit: RequestInit = {
      method: method,
      headers: header,
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

  GET(path: string, header: any, pathVariables: any, successCB: Callback, failCB?: Callback): void {
    var url: string = this.initialUrl(path, pathVariables);
    var requestInit: RequestInit = this.initRequest(HttpMethod.GET, header);
    this.doFetch(url, requestInit, successCB, failCB);
  }

  POST(path: string, header: any, requestBody: any, successCB: Callback, failCB?: Callback): void {
    var url: string = this.initialUrl(path);
    var requestInit: RequestInit = this.initRequest(HttpMethod.POST, header, requestBody);
    this.doFetch(url, requestInit, successCB, failCB);
  }
}