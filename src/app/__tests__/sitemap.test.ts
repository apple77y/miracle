import sitemap, { dynamic } from '../sitemap'

describe('sitemap', () => {
  it('is configured as force-static', () => {
    expect(dynamic).toBe('force-static')
  })

  it('returns expected routes with stable metadata', () => {
    const result = sitemap()
    const expectedDate = new Date('2024-12-31').getTime()
    const lastModified = result[2].lastModified
    const normalizedDate =
      typeof lastModified === 'string'
        ? new Date(lastModified).getTime()
        : lastModified?.getTime()

    expect(result).toHaveLength(3)
    expect(result.map((entry) => entry.url)).toEqual([
      'https://miracle-flower.vercel.app',
      'https://miracle-flower.vercel.app/guide',
      'https://miracle-flower.vercel.app/occasion',
    ])
    expect(result[0].priority).toBe(1)
    expect(result[1].changeFrequency).toBe('monthly')
    expect(normalizedDate).toBe(expectedDate)
  })
})
