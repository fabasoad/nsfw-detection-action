import FormData from 'form-data'
import { PathLike, statSync, createReadStream } from 'fs'
import { basename } from 'path'
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

  public async getScore(apiKey: string, file: PathLike): Promise<number> {
    const body = new FormData()
    body.append('file_image', createReadStream(file), {
      knownLength: statSync(file).size,
      filename: basename(file.toString()),
      filepath: file.toString()
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
      return 0
    } else {
      return confidence_score_decision!
    }
  }
}
