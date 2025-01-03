import fs from 'fs'
import CloudmersiveImageApiClient from 'cloudmersive-image-api-client'
import { Logger } from 'winston'
import { getLogger } from '../../utils/LoggerFactory'
import { INsfwDetectionProvider } from '../NsfwDetectionProviderFactory'

type CloudmersiveResponse = {
  Score: number,
  Successful: boolean,
  ClassificationOutcome: string
}

export class CloudmersiveNsfwDetectionProvider
  implements INsfwDetectionProvider {
  private readonly logger: Logger = getLogger()

  public async getScore(apiKey: string, file: fs.PathLike): Promise<number | null> {
    const defaultClient = CloudmersiveImageApiClient.ApiClient.instance
    const Apikey = defaultClient.authentications['Apikey']
    Apikey.apiKey = apiKey
    const apiInstance = new CloudmersiveImageApiClient.NsfwApi()
    const imageFile = Buffer.from(fs.readFileSync(file).buffer)
    return new Promise<number | null>((resolve, reject) => {
      const callback = (error, { Successful, Score }: CloudmersiveResponse, response) => {
        if (error) {
          if (!response.ok) {
            this.logger.error(`Status: ${response.status}. Reason: ${response.statusText}`)
          }
          reject(error)
        } else {
          if (!Successful) {
            this.logger.warning(`There was a problem during ${file} file classification`)
            resolve(null)
          } else {
            resolve(Score)
          }
        }
      }
      apiInstance.nsfwClassify(imageFile, callback)
    })
  }
}
