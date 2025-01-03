import fs from 'fs'
import CloudmersiveImageApiClient from 'cloudmersive-image-api-client'
import NsfwDetectionProviderBase from './NsfwDetectionProviderBase'

export class CloudmersiveNsfwDetectionProvider
  extends NsfwDetectionProviderBase {
  constructor() {
    super('')
  }

  public async getScore(apiKey: string, file: fs.PathLike): Promise<number> {
    const defaultClient = CloudmersiveImageApiClient.ApiClient.instance
    const Apikey = defaultClient.authentications['Apikey']
    Apikey.apiKey = apiKey
    const apiInstance = new CloudmersiveImageApiClient.NsfwApi()
    const imageFile = Buffer.from(fs.readFileSync(file).buffer)
    return new Promise((resolve, reject) => {
      apiInstance.nsfwClassify(imageFile, (error, data, response) => {
        if (error) {
          reject(error)
        } else {
          resolve(Number(data['Score']))
        }
      })
    })
  }
}
