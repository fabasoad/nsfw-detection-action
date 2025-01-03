import FormData from 'form-data'
import fs from 'fs'
import NsfwDetectionProviderBase from './NsfwDetectionProviderBase'

type SightEngineError = {
  type: string,
  code: number,
  message: string
}

type SightEngineNudity = {
  sexual_activity: number,
  sexual_display: number,
  erotica: number
}

type SightEngineResponse = {
  status: string,
  nudity?: SightEngineNudity,
  error?: SightEngineError
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
    body.append('models', 'nudity-2.1')
    body.append('api_user', apiKeys[0])
    body.append('api_secret', apiKeys[1])

    const { status, nudity, error } = await this.request<SightEngineResponse>(body)
    if (status === 'failure') {
      const { type, code, message }: SightEngineError = error!
      this.logger.warning(
        `There was a problem during ${file} file classification. Type: ${type}.`
        + ` Code: ${code}. Reason: ${message}`
      )
      return 0
    } else {
      const { sexual_activity, sexual_display, erotica } = nudity!
      return Math.max(sexual_activity, sexual_display, erotica)
    }
  }
}
