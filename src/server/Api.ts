import { Callback, HttpMethod } from "utils/type";

export abstract class Api {
  serverUrl: string;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  /**
   * @param path = 'api'
   * @param pathVariables = { search: 'javascript', page: 2, sort: 'desc' }. Usually for HTTP GET
   * @returns https://example.com/api?search=javascript&page=2&sort=desc
   */
  initialUrl(path: string, pathVariables?: any): string {
    if (pathVariables) {
      path = path + '?' + Object.keys(pathVariables).map(function (k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(pathVariables[k]);
      }).join('&')
    }
    if (path.startsWith('/')) return this.serverUrl + path;
    return this.serverUrl + '/' + path;
  }

  initRequest(method: HttpMethod, requestBody?: any): RequestInit {;
    let body: any = null;
    if (requestBody) body = JSON.stringify(requestBody);
    let requestInit: RequestInit = {
      method: method,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': "*"
      },
      mode: 'cors',
      cache: 'no-cache',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: body,
    }
    return requestInit;
  }

  doFetch(url: string, requestInit: RequestInit, successCB: Callback, failCB?: Callback) {
    if (!failCB) failCB = (response: any) => {
      console.log(response);
    }

    fetch(url, requestInit).then((res: Response) => {
      return res.json();
    }).then((res: any) => {
      if (res.status === res.OK) {
        successCB(res);
      } else {
        if (failCB) failCB(res);
      }
    }).catch((error: Error) => {
      console.log(`Mini App UI error: \n${error}`);
    });
  }
}