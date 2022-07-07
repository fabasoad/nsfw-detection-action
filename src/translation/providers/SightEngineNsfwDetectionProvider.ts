import FormData from 'form-data'
import fs from 'fs'
import NsfwDetectionProviderBase from './NsfwDetectionProviderBase'
import LoggerFactory from '../../utils/LoggerFactory'
import { Logger } from 'winston'

type SightEngineResponse = {
  status: string
  nudity: {
    raw: number
  }
}

export class SightEngineNsfwDetectionProvider
  extends NsfwDetectionProviderBase {
  private readonly logger: Logger =
    LoggerFactory.create(SightEngineNsfwDetectionProvider.name)

  constructor() {
    super('https://api.sightengine.com/1.0/check.json')
  }

  public async getScore(apiKey: string, file: fs.PathLike): Promise<number> {
    const apiKeys = apiKey.split(',')
    this.logger.debug(`API key has ${apiKeys.length} parts ` +
      `[${apiKeys[0].length}:${apiKeys[1].length}]`)
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
