export default class HttpClient {
  public async request<TResponse>(
    url: string, init?: RequestInit
  ): Promise<TResponse> {
    const response = await fetch(url, init)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data as TResponse;
  }
}
