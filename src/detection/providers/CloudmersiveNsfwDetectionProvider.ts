import fs from 'fs'
import CloudmersiveValidateApiClient from 'cloudmersive-validate-api-client'
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
    const client = CloudmersiveValidateApiClient.ApiClient.instance
    console.dir(client)
    return 0
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
