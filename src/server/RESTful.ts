import { Api } from "./Api";
import { Callback, HttpMethod } from "utils";

export class RESTful extends Api {

  GET(path: string, pathVariables: any, successCB: Callback, failCB?: Callback): void {
    var url: string = this.initialUrl(path, pathVariables);
    var requestInit: RequestInit = this.initRequest(HttpMethod.GET);
    this.doFetch(url, requestInit, successCB, failCB);
  }
  
  POST(path: string, requestBody: any, successCB: Callback, failCB?: Callback): void {
    var url: string = this.initialUrl(path);
    var requestInit: RequestInit = this.initRequest(HttpMethod.POST, requestBody);
    this.doFetch(url, requestInit, successCB, failCB);
  }

  PUT(path: string, requestBody: any, successCB: Callback, failCB?: Callback): void {
    var url: string = this.initialUrl(path);
    var requestInit: RequestInit = this.initRequest(HttpMethod.PUT, requestBody);
    this.doFetch(url, requestInit, successCB, failCB);
  }

  DELETE(path: string, requestBody: any, successCB: Callback, failCB?: Callback): void {
    var url: string = this.initialUrl(path);
    var requestInit: RequestInit = this.initRequest(HttpMethod.DELETE, requestBody);
    this.doFetch(url, requestInit, successCB, failCB);
  }
} 

const restful = new RESTful("http://localhost:xxxx_port");
export { restful };