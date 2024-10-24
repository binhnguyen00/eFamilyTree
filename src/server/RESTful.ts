class RESTful {
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

  async doFetch(url: string, requestInit: RequestInit) {
    return fetch(url, requestInit);
  }

  initRequest(method: "GET" | "POST", requestBody?: any): RequestInit {
    return {
      method: method,
      cache: 'no-cache',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: requestBody
    } as RequestInit;
  }

  async GET(path: string, pathVariables: any) {
    var url: string = this.initialUrl(path, pathVariables);
    var requestInit: RequestInit = this.initRequest("GET");
    return await this.doFetch(url, requestInit);
  }
  
  async POST(path: string, requestBody: any) {
    var url: string = this.initialUrl(path);
    var requestInit: RequestInit = this.initRequest("POST", requestBody);
    return await this.doFetch(url, requestInit);
  }
} 

const restful = new RESTful("http://localhost:xxxx_port");
export { restful };