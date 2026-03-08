import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IntlProvider } from 'react-intl'
import BackgroundMusic from '../../ui/BackgroundMusic'
import enMessages from '../../../../messages/en.json'

jest.mock('../../../hooks/useIsPWA', () => ({
  useIsPWA: jest.fn(),
}))

const { useIsPWA } = jest.requireMock('../../../hooks/useIsPWA') as {
  useIsPWA: jest.Mock
}

const renderMusic = () =>
  render(
    <IntlProvider messages={enMessages} locale="en">
      <BackgroundMusic />
    </IntlProvider>,
  )

describe('BackgroundMusic behavior branches', () => {
  const play = jest.fn().mockResolvedValue(undefined)
  const pause = jest.fn()
  const load = jest.fn()
  const originalConsoleLog = console.log
  const originalConsoleError = console.error

  beforeEach(() => {
    jest.clearAllMocks()
    useIsPWA.mockReturnValue(false)

    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      value: play,
    })
    Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
      configurable: true,
      value: pause,
    })
    Object.defineProperty(HTMLMediaElement.prototype, 'load', {
      configurable: true,
      value: load,
    })
  })

  afterEach(() => {
    console.log = originalConsoleLog
    console.error = originalConsoleError
    jest.useRealTimers()
  })

  it('returns null in PWA mode', () => {
    useIsPWA.mockReturnValue(true)
    const { container } = renderMusic()
    expect(container.firstChild).toBeNull()
  })

  it('logs autoplay failure when play is rejected', async () => {
    jest.useFakeTimers()
    play.mockRejectedValueOnce(new Error('autoplay blocked'))
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    renderMusic()

    await act(async () => {
      jest.advanceTimersByTime(1000)
    })

    await waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith('Auto-play failed, user interaction required:', expect.any(Error))
    })
  })

  it('calls load before play when readyState is low', async () => {
    jest.useFakeTimers()
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    renderMusic()

    const audio = document.querySelector('audio') as HTMLAudioElement
    Object.defineProperty(audio, 'readyState', {
      configurable: true,
      get: () => 0,
    })

    await user.click(screen.getByRole('button', { name: 'Play music' }))

    expect(load).toHaveBeenCalled()
  })

  it('handles playback error in manual toggle path', async () => {
    const user = userEvent.setup()
    play.mockRejectedValueOnce(new Error('manual play failed'))
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    renderMusic()
    await user.click(screen.getByRole('button', { name: 'Play music' }))

    expect(errorSpy).toHaveBeenCalledWith('Audio playback failed:', expect.any(Error))
    expect(logSpy).toHaveBeenCalledWith('음악 재생에 실패했습니다. 브라우저 설정이나 네트워크 문제일 수 있습니다.')
  })

  it('handles cleanup exceptions on unmount', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    pause.mockImplementation(() => {
      throw new Error('cleanup fail')
    })

    const { unmount } = renderMusic()
    unmount()

    expect(logSpy).toHaveBeenCalledWith('Audio cleanup error:', expect.any(Error))
  })
})
