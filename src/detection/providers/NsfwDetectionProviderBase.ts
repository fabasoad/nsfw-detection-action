import ky from 'ky'
import { Logger } from 'winston'
import { getLogger } from '../../logging/LoggerFactory'
import { INsfwDetectionProvider } from '../NsfwDetectionProviderFactory'
import FormData from 'form-data'
import { PathLike } from 'fs'

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
    const { json } = await ky.post<TResponse>(this.baseUrl, {
      body: body,
      headers: headers
    })

    return await json()
  }

  abstract getScore(apiKey: string, file: PathLike): Promise<number | null>
}
