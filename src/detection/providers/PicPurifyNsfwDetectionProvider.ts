import FormData from 'form-data'
import fs from 'fs'
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

  public async getScore(apiKey: string, file: fs.PathLike): Promise<number> {
    const body = new FormData()
    body.append('file_image', fs.createReadStream(file))
    body.append('API_KEY', '0MheTYpOuZcIqCBZWKA2otIRl9P73i8T')
    body.append('task', 'porn_moderation,suggestive_nudity_moderation')

    const headers = body.getHeaders()
    headers['API_KEY'] = '0MheTYpOuZcIqCBZWKA2otIRl9P73i8T'

    const resp = await this.request<PicPurifyResponse>(body, headers)
    if (resp.status !== 'success') {
      const message = resp.error && resp.error.errorMsg ?
        resp.error.errorMsg : `Failed to analyze ${file}.`
      throw new Error(message)
    }
    return resp.confidence_score_decision
  }
}
