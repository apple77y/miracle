import { render } from '@testing-library/react'
import * as ReactDOM from 'react-dom'
import ResourceHints from '../ResourceHints'

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  prefetchDNS: jest.fn(),
  preconnect: jest.fn(),
  preload: jest.fn(),
}))

describe('ResourceHints', () => {
  const prefetchDNSSpy = ReactDOM.prefetchDNS as jest.Mock
  const preconnectSpy = ReactDOM.preconnect as jest.Mock
  const preloadSpy = ReactDOM.preload as jest.Mock

  beforeEach(() => {
    prefetchDNSSpy.mockClear()
    preconnectSpy.mockClear()
    preloadSpy.mockClear()
  })

  it('registers dns-prefetch, preconnect, and preload hints', () => {
    const { container } = render(<ResourceHints />)

    expect(prefetchDNSSpy).toHaveBeenCalledWith('https://hangeul.pstatic.net')
    expect(preconnectSpy).toHaveBeenCalledWith('https://hangeul.pstatic.net', { crossOrigin: '' })
    expect(preloadSpy).toHaveBeenCalledWith(
      'https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css',
      { as: 'style' }
    )
    expect(container.firstChild).toBeNull()
  })
})
