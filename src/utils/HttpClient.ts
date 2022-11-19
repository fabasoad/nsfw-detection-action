import fetch, { RequestInit } from 'node-fetch'

export default class HttpClient {
  public request<TResponse>(
    url: string, init?: RequestInit
  ): Promise<TResponse> {
    return fetch(url, init)
      .then(({ json }) => json())
      .then((data) => data as TResponse)
  }
}
