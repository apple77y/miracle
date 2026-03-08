import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OfflineClient from '../OfflineClient'

describe('OfflineClient', () => {
  const originalFetch = global.fetch
  const originalAlert = window.alert

  beforeEach(() => {
    jest.useFakeTimers()
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => false,
    })
    global.fetch = jest.fn()
    window.alert = jest.fn()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    global.fetch = originalFetch
    window.alert = originalAlert
  })

  it('renders offline state and goes back on back button click', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    const backSpy = jest.spyOn(window.history, 'back').mockImplementation(() => {})

    render(<OfflineClient />)

    expect(screen.getByText('오프라인 상태')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '이전 페이지로' }))
    expect(backSpy).toHaveBeenCalled()

    backSpy.mockRestore()
  })

  it('redirects on retry when online', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<OfflineClient />)

    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => true,
    })

    await user.click(screen.getByRole('button', { name: '다시 시도' }))
    fireEvent(window, new Event('online'))
    expect(screen.getByText('연결 복구됨!')).toBeInTheDocument()
  })

  it('tries HEAD request and redirects when retry succeeds while offline', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true })

    render(<OfflineClient />)

    await user.click(screen.getByRole('button', { name: '다시 시도' }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/', { method: 'HEAD', cache: 'no-cache' })
    })
  })

  it('shows alert when retry fails while offline', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('network'))

    render(<OfflineClient />)

    await user.click(screen.getByRole('button', { name: '다시 시도' }))

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('아직 인터넷에 연결되지 않았습니다.')
    })
  })

  it('switches to online UI and redirects after online event', async () => {
    render(<OfflineClient />)

    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => true,
    })

    fireEvent(window, new Event('online'))

    expect(screen.getByText('연결 복구됨!')).toBeInTheDocument()

    jest.advanceTimersByTime(1000)
    expect(screen.getByText('잠시 후 자동으로 이동됩니다...')).toBeInTheDocument()
  })

  it('switches back to offline UI on offline event', () => {
    render(<OfflineClient />)

    fireEvent(window, new Event('offline'))

    expect(screen.getByText('오프라인 상태')).toBeInTheDocument()
  })
})
