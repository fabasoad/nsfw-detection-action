import fs from 'fs'
import CloudmersiveImageApiClient from 'cloudmersive-image-api-client'
import NsfwDetectionProviderBase from './NsfwDetectionProviderBase'

type CloudmersiveResponse = {
  Score: number
}

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
    console.dir(apiInstance)
    apiInstance.nsfwClassify(imageFile, (error, data, response) => {
      if (error) {
        console.error(error);
      } else {
        console.log('API called successfully. Returned data: ' + data);
      }
    })
    return 0
    // const client = CloudmersiveValidateApiClient.ApiClient.instance
    // console.dir(client)
    // return 0
    // const body = new FormData()
    // body.append('imageFile', fs.createReadStream(file))
    //
    // const headers = body.getHeaders()
    // headers['apikey'] = apiKey
    //
    // const resp = await this.request<CloudmersiveResponse>(body, headers)
    // return resp.Score
  }
}
