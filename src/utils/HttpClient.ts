export class HTTPError extends Error {
  constructor(status: number, message: string) {
    super(`Status: ${status}. Reason: ${message}`)
    this.name = 'HTTPError'
  }
}

export default class HttpClient {
  public async request<TResponse>(
    url: string, init?: RequestInit
  ): Promise<TResponse> {
    const response = await fetch(url, init)

    if (!response.ok) {
      throw new HTTPError(response.status, response.statusText);
    }

    const data = await response.json();
    return data as TResponse;
  }
}
