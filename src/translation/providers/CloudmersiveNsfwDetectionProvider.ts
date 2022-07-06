import FormData from 'form-data'
import fs from 'fs'
import NsfwDetectionProviderBase from './NsfwDetectionProviderBase'

type CloudmersiveResponse = {
  Score: number
}

export class CloudmersiveNsfwDetectionProvider
  extends NsfwDetectionProviderBase {
  constructor() {
    super('https://api.cloudmersive.com/image/nsfw/classify')
  }

  public async getScore(apiKey: string, file: fs.PathLike): Promise<number> {
    const body = new FormData();
    body.append('imageFile', fs.createReadStream(file));

    const headers = body.getHeaders()
    headers['apikey'] = apiKey

    const resp = await this.request<CloudmersiveResponse>(body, headers)
    return resp.Score
  }
}
