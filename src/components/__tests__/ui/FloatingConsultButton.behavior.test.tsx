import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IntlProvider } from 'react-intl'
import FloatingConsultButton from '../../ui/FloatingConsultButton'
import enMessages from '../../../../messages/en.json'

const renderButton = () =>
  render(
    <IntlProvider messages={enMessages} locale="en">
      <FloatingConsultButton />
    </IntlProvider>,
  )

describe('FloatingConsultButton behavior branches', () => {
  const originalOpen = window.open
  const originalUA = navigator.userAgent

  beforeEach(() => {
    jest.clearAllMocks()
    window.open = jest.fn()
  })

  afterEach(() => {
    window.open = originalOpen
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: originalUA,
    })
  })

  it('mobile path opens instagram web fallback after deep-link attempt', async () => {
    jest.useFakeTimers()
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    })

    renderButton()
    await user.click(screen.getByRole('button', { name: 'Consultation' }))

    act(() => {
      jest.advanceTimersByTime(1500)
    })

    expect(window.open).toHaveBeenCalledWith('https://www.instagram.com/miracle_flowerstudio/', '_blank')
    consoleErrorSpy.mockRestore()
    jest.useRealTimers()
  })
})
