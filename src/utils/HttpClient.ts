class HTTPError extends Error {
  constructor(status: number, message: string) {
    super(`Status: ${status}. Reason: ${message}`)
    this.name = 'HTTPError'
  }
}

export default class HttpClient {
  public async request<TResponse>(
    url: string, init?: RequestInit
  ): Promise<TResponse> {
    const { ok, status, statusText, json } = await fetch(url, init)

    if (!ok) {
      throw new HTTPError(status, statusText)
    }

    return await json() as TResponse
  }
}
