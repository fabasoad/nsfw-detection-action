import FormData from 'form-data'
import { PathLike, statSync, createReadStream } from 'fs'
import NsfwDetectionProviderBase from './NsfwDetectionProviderBase'

type PicPurifyError = {
  errorCode: number,
  errorMsg: string
}

type PicPurifyResponse = {
  status: string
  error?: PicPurifyError
  confidence_score_decision?: number
}

export class PicPurifyNsfwDetectionProvider extends NsfwDetectionProviderBase {
  constructor() {
    super('https://www.picpurify.com/analyse/1.1')
  }

  public async getScore(apiKey: string, file: PathLike): Promise<number | null> {
    const body = new FormData()
    body.append('file_image', createReadStream(file), {
      knownLength: statSync(file).size
    })
    body.append('API_KEY', apiKey)
    body.append('task', 'porn_moderation,suggestive_nudity_moderation')

    const { status, error, confidence_score_decision } =
      await this.request<PicPurifyResponse>(body)
    if (status === 'failure') {
      const { errorCode, errorMsg }: PicPurifyError = error!
      this.logger.warning(
        `There was a problem during ${file} file classification. `
          + `Code: ${errorCode}. Reason: ${errorMsg}`
      )
      return null
    } else {
      return confidence_score_decision!
    }
  }
}
