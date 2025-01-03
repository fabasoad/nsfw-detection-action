import fs from 'fs'
import {
  CloudmersiveNsfwDetectionProvider
} from './providers/CloudmersiveNsfwDetectionProvider'
import {
  PicPurifyNsfwDetectionProvider
} from './providers/PicPurifyNsfwDetectionProvider'
import {
  SightEngineNsfwDetectionProvider
} from './providers/SightEngineNsfwDetectionProvider'

export interface INsfwDetectionProvider {
  getScore(apiKey: string, file: fs.PathLike): Promise<number | null>
}

export class NsfwDetectionProviderFactory {
  public static getProvider(name: string): INsfwDetectionProvider {
    switch (name) {
    case 'cloudmersive': return new CloudmersiveNsfwDetectionProvider()
    case 'picpurify': return new PicPurifyNsfwDetectionProvider()
    case 'sightengine': return new SightEngineNsfwDetectionProvider()
    default:
      throw new Error(`${name} provider is not supported`)
    }
  }
}
