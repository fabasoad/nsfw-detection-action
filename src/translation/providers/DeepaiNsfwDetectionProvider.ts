import FormData from 'form-data'
import fs from 'fs'
import NsfwDetectionProviderBase from './NsfwDetectionProviderBase'

type DeepaiResponse = {
  output: {
    nsfw_score: number
  }
}

export class DeepaiNsfwDetectionProvider extends NsfwDetectionProviderBase {
  constructor() {
    super('https://api.deepai.org/api/nsfw-detector')
  }

  public async getScore(apiKey: string, file: fs.PathLike): Promise<number> {
    const body = new FormData()
    body.append('image', fs.createReadStream(file))

    const headers = body.getHeaders()
    headers['api-key'] = apiKey

    const resp = await this.request<DeepaiResponse>(body, headers)
    return resp.output.nsfw_score
  }
}
