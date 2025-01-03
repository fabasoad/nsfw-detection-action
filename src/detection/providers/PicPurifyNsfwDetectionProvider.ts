import FormData from 'form-data'
import { PathLike, Stats, statSync, createReadStream } from 'fs'
import { resolve } from 'path'
import NsfwDetectionProviderBase from './NsfwDetectionProviderBase'

type PicPurifyResponse = {
  status: string
  error: {
    errorMsg: string
  }
  confidence_score_decision: number
}

export class PicPurifyNsfwDetectionProvider extends NsfwDetectionProviderBase {
  constructor() {
    super('https://www.picpurify.com/analyse/1.1')
  }

  public async getScore(apiKey: string, file: PathLike): Promise<number> {
    const body = new FormData()
    const { size }: Stats = statSync(file)
    body.append('file_image', createReadStream(file), {
      knownLength: size,
      filename: file.toString(),
      filepath: resolve(file.toString())
    })
    body.append('API_KEY', apiKey)
    body.append('task', 'porn_moderation,suggestive_nudity_moderation')

    const resp = await this.request<PicPurifyResponse>(body)
    if (resp.status !== 'success') {
      const message = resp.error && resp.error.errorMsg ?
        resp.error.errorMsg : `Failed to analyze ${file}.`
      throw new Error(message)
    }
    return resp.confidence_score_decision
  }
}
