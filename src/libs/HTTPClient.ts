interface IMap {
  [key: string]: string;
}
type CacheStrategy = "no-store" | "force-cache";
type InternalClient = (method: string, route: string, cacheStrategy: CacheStrategy, body?: BodyInit) => Promise<Response | null>;
export default class HTTPClient {
  private readonly uri: string;

  private cachedHeaders: IMap;
  public get CachedHeaders(): HeadersInit { return this.cachedHeaders; }
  public set NewHeaders(value: IMap) { this.cachedHeaders = {...this.cachedHeaders, ...value}; }
  public set Header(value: [string, string]) { this.cachedHeaders[value[0]] = value[1]; };

  private cacheStrategy: CacheStrategy;
  private cacheLifetime: number; 

  constructor(uri: string, headers?: IMap, cacheStrategy: CacheStrategy = "no-store", cacheLifetime = 0) {
    this.uri = uri;
    this.cachedHeaders = headers ?? {
      // Set default headers here if necessary
      "content-type": "application/json",
      "Authorization": process.env.API_KEY!,
    };
    this.cacheStrategy = cacheStrategy;
    this.cacheLifetime = cacheLifetime;
  }

  private async getClientAsync(reset?: boolean): Promise<InternalClient> {
    const headers = this.cachedHeaders;
    if (headers === undefined || reset) {
      this.NewHeaders = {
        // update headers if necessary (e.g., tokens n stuff)
        // Don't put anything sensitive, unless explicitly from process.env
      };
    }

    const client: InternalClient =
      async (method: string, route: string, body?: BodyInit) => {
        try {
          return await fetch(
            new Request(
              new URL(route, this.uri),
              {
                method: method,
                headers: headers,
                body: body ? JSON.stringify(body) : undefined,
                cache: this.cacheStrategy,
                next: {
                  revalidate: this.cacheLifetime
                }
              }
            )
          )
        } catch (err) {
          console.error(`fetch failed: ${err}`);
          console.error("route was: " + route);
          return null;
        }
      };

    return client;
  }

  private async actAsyncInternal(mode: string, route: string, body?: any): Promise<Response | null> {
    const action = async (client: InternalClient) => await client(mode, route, body);

    let client = await this.getClientAsync();
    const httpResponse = await action(client);

    if (!httpResponse) return null;

    if (httpResponse.status === 401) { // Unauthorized
      client = await this.getClientAsync(true);
      return await action(client);
    } else {
      return httpResponse;
    }
  }

  private async actAsync<T = any>(mode: string, route: string, body?: any, isVoid: boolean = false): Promise<[T | null, number, string | null]> {
    const httpResponse = await this.actAsyncInternal(mode, route, body);
    if (!httpResponse)
      return [null, 404, "fetch failed"];

    const resBody = await httpResponse.text();
    // if (process.env.NODE_ENV == "development") {
    //   console.log("request route: " + route);
    //   console.log("response body:\n" + resBody);
    // }

    if (isVoid)
      return [null, httpResponse.status, null];

    let json;
    try {
      json = JSON.parse(resBody);
    } catch (err) {
      const message = `Error processing request ${route} -> ${err}`;
      console.log(message);
      return [null, httpResponse.status || 500, message];
    }
    if (!httpResponse.ok)
      return [null, httpResponse.status, json.message];
    
    return [json as T, httpResponse.status, null];
  }

  public GetAsync = async <T = any>(route: string, body?: any): Promise<[T | null, number, string | null]> =>
    await this.actAsync<T>("get", route, body);

  public PostAsync = async <T = any>(route: string, body?: any, isVoid: boolean = false): Promise<[T | null, number, string | null]> =>
    await this.actAsync<T>("post", route, body, isVoid);

  public PutAsync = async <T = any>(route: string, body?: any, isVoid: boolean = false): Promise<[T | null, number, string | null]> =>
    await this.actAsync<T>("put", route, body, isVoid);

  public DeleteAsync = async <T = any>(route: string, body?: any, isVoid: boolean = false): Promise<[T | null, number, string | null]> =>
    await this.actAsync<T>("delete", route, body, isVoid);
}
