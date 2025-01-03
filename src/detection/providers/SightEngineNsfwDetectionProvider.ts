import FormData from 'form-data'
import fs from 'fs'
import NsfwDetectionProviderBase from './NsfwDetectionProviderBase'

type SightEngineResponse = {
  status: string
  nudity: {
    sexual_activity: number,
    sexual_display: number,
    erotica: number,
  }
}

export class SightEngineNsfwDetectionProvider
  extends NsfwDetectionProviderBase {
  constructor() {
    super('https://api.sightengine.com/1.0/check.json')
  }

  public async getScore(apiKey: string, file: fs.PathLike): Promise<number> {
    const apiKeys: string[] = apiKey.split(',')
    const body = new FormData()
    body.append('media', fs.createReadStream(file))
    body.append('api_user', apiKeys[0])
    body.append('api_secret', apiKeys[1])
    body.append('models', 'nudity-2.1')

    const { status, nudity } = await this.request<SightEngineResponse>(body)
    if (status !== 'success') {
      this.logger.warning(`There was a problem during ${file} file classification`)
    }
    return Math.max(nudity.sexual_activity, nudity.sexual_display, nudity.erotica)
  }
}
