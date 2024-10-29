import { ExternalRESTful } from "./ExternalRESTful";
import { HttpMethod } from "../utils/Interface";

export class OdooRESTful extends ExternalRESTful {

  public async asyncPOST(path: string, header: any, body: any) {
    var url: string = this.initialUrl(path);
    var requestInit: RequestInit = this.initRequest(HttpMethod.POST, header, body);
    return await fetch(url, requestInit).then((res: Response) => {
      const result = res.json();
      return this.getResponseResult(result);
    });
  }

  public async asyncGET(path: string, header: any, pathVariables: any) {
    var url: string = this.initialUrl(path, pathVariables);
    var requestInit: RequestInit = this.initRequest(HttpMethod.GET, header);
    return await fetch(url, requestInit).then((res: Response) => {
      const result = res.json();
      return this.getResponseResult(result);
    });
  }

  private getResponseResult(response: any): any {
    /* Odoo Server Response
    {
      "jsonrpc": "2.0",
      "id": 1297312732103,
      "result": {
        "error": "" / [] / 2 / {}
      }
    } */
    if (!response) return "No Response from Server!";
    if (response.result.error) {
      return response.result.error;
    } 
    return response.result as any;
  }
}