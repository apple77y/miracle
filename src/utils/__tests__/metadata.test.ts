import { getJsonLd, getMetadata, getViewport } from '../metadata'

describe('metadata utils', () => {
  it('returns korean metadata by default', () => {
    const metadata = getMetadata()

    expect(metadata.title).toBe('Miracle Flower - 미라클 플라워 | 성남 분당 꽃집')
    expect(metadata.openGraph?.locale).toBe('ko_KR')
    expect(metadata.alternates?.canonical).toBe('https://miracle-flower.vercel.app')
  })

  it('returns english metadata when locale is en', () => {
    const metadata = getMetadata('en')

    expect(metadata.title).toBe('Miracle Flower | Premium Flower Shop in Bundang, Seongnam')
    expect(metadata.openGraph?.locale).toBe('en_US')
    expect(metadata.keywords).toContain('flower shop')
  })

  it('returns fixed viewport options for mobile behavior', () => {
    const viewport = getViewport()

    expect(viewport).toMatchObject({
      width: 'device-width',
      initialScale: 1,
      userScalable: false,
      themeColor: '#7c8c6e',
    })
  })

  it('returns local business plus product schema entries', () => {
    const jsonLd = getJsonLd('ko')

    expect(jsonLd).toHaveLength(4)
    expect(jsonLd[0]['@type']).toBe('LocalBusiness')
    expect(jsonLd[0].name).toContain('미라클 플라워')
    expect(jsonLd[1]['@type']).toBe('Product')
  })
})
