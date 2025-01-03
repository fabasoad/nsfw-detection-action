import ky from 'ky'
import { Logger } from 'winston'
import { getLogger } from '../../logging/LoggerFactory'
import { INsfwDetectionProvider } from '../NsfwDetectionProviderFactory'
import FormData from 'form-data'
import { PathLike } from 'fs'

class HTTPError extends Error {
  constructor(status: number, message: string) {
    super(`Status: ${status}. Reason: ${message}`)
    this.name = 'HTTPError'
  }
}

export default abstract class NsfwDetectionProviderBase
implements INsfwDetectionProvider {
  private readonly baseUrl: string

  protected readonly logger: Logger = getLogger()

  protected constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  protected async request<TResponse>(
    body: FormData, headers?: FormData.Headers
  ): Promise<TResponse> {
    const { ok, status, statusText, json } = await ky.post<TResponse>(this.baseUrl, {
      body: body,
      headers: headers
    })

    if (!ok) {
      throw new HTTPError(status, statusText)
    }

    return await json()
  }

  abstract getScore(apiKey: string, file: PathLike): Promise<number | null>
}
