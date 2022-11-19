import {
  INsfwDetectionProvider,
  NsfwDetectionProviderFactory
} from '../../detection/NsfwDetectionProviderFactory'
import itParam from 'mocha-param'
import {
  CloudmersiveNsfwDetectionProvider
} from '../../detection/providers/CloudmersiveNsfwDetectionProvider'
import {
  DeepaiNsfwDetectionProvider
} from '../../detection/providers/DeepaiNsfwDetectionProvider'
import {
  PicPurifyNsfwDetectionProvider
} from '../../detection/providers/PicPurifyNsfwDetectionProvider'
import {
  SightEngineNsfwDetectionProvider
} from '../../detection/providers/SightEngineNsfwDetectionProvider'

type NsfwDetectionProviderFactorySpecFixture = {
  className: string,
  paramName: string
}

describe(NsfwDetectionProviderFactory.name, () => {
  const fixture: NsfwDetectionProviderFactorySpecFixture[] = [
    {
      className: CloudmersiveNsfwDetectionProvider.name,
      paramName: 'cloudmersive'
    },
    { className: DeepaiNsfwDetectionProvider.name, paramName: 'deepai' },
    { className: PicPurifyNsfwDetectionProvider.name, paramName: 'picpurify' },
    {
      className: SightEngineNsfwDetectionProvider.name,
      paramName: 'sightengine'
    }
  ]
  itParam('should return ${value.className} instance', fixture,
    (value: NsfwDetectionProviderFactorySpecFixture) => {
      const provider: INsfwDetectionProvider =
          NsfwDetectionProviderFactory.getProvider(value.paramName)
      expect(provider.constructor.name).toBe(value.className)
    })
  it('should throw error', () => {
    const name = 'randomstring'
    expect(() => NsfwDetectionProviderFactory.getProvider(name))
      .toThrowError(`${name} provider is not supported`)
  });
})
