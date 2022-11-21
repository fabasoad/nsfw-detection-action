import { INsfwDetectionProvider } from '../NsfwDetectionProviderFactory'
import HttpClient from '../../utils/HttpClient'
import FormData from 'form-data'
import { PathLike } from 'fs'

export default abstract class NsfwDetectionProviderBase
implements INsfwDetectionProvider {
  private readonly baseUrl: string
  private readonly client = new HttpClient()

  protected constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  protected request<TResponse>(body: FormData): Promise<TResponse> {
    return this.client.request<TResponse>(this.baseUrl, {
      method: 'post',
      body,
      headers: body.getHeaders()
    })
  }

  abstract getScore(apiKey: string, file: PathLike): Promise<number>
}
