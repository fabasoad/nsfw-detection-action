import FormData from 'form-data'
import fs from 'fs'
import NsfwDetectionProviderBase from './NsfwDetectionProviderBase'

type SightEngineResponse = {
  status: string
  nudity: {
    raw: number
  }
}

export class SightEngineNsfwDetectionProvider
  extends NsfwDetectionProviderBase {
  constructor() {
    super('https://api.sightengine.com/1.0/check.json')
  }

  public async getScore(apiKey: string, file: fs.PathLike): Promise<number> {
    const apiKeys = apiKey.split(',')
    const body = new FormData()
    body.append('media', fs.createReadStream(file))
    body.append('api_user', apiKeys[0])
    body.append('api_secret', apiKeys[1])
    body.append('models', 'nudity')

    const resp = await this.request<SightEngineResponse>(body)
    if (resp.status !== 'success') {
      throw new Error(`Failed to analyze ${file}.`)
    }
    return resp.nudity.raw
  }
}
