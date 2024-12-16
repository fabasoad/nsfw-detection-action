export default class HttpClient {
  public async request<TResponse>(
    url: string, init?: RequestInit
  ): Promise<TResponse> {
    const { json } = await fetch(url, init)
    return await json() as TResponse
  }
}
