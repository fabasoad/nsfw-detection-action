export default class HttpClient {
  public async request<TResponse>(
    url: string, init?: RequestInit
  ): Promise<TResponse> {
    console.log('>> 1')
    const { json } = await fetch(url, init)
    console.log('>> 2')
    console.dir(json())
    return await json() as TResponse
  }
}
