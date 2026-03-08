import { render, screen } from '@testing-library/react'
import { act } from 'react'
import userEvent from '@testing-library/user-event'
import ToastNotification from '../../ui/ToastNotification'

describe('ToastNotification', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  it('returns null when hidden', () => {
    const { container } = render(
      <ToastNotification title="title" message="message" isVisible={false} onClose={jest.fn()} />,
    )

    expect(container.firstChild).toBeNull()
  })

  it('renders content and auto-closes after duration', () => {
    const onClose = jest.fn()

    render(
      <ToastNotification title="알림" message="테스트 메시지" isVisible onClose={onClose} duration={1000} />,
    )

    expect(screen.getByText('알림')).toBeInTheDocument()
    expect(screen.getByText('테스트 메시지')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(1000)
      jest.advanceTimersByTime(300)
    })
    expect(onClose).toHaveBeenCalled()
  })

  it('closes when close button is clicked', async () => {
    const onClose = jest.fn()
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

    render(
      <ToastNotification title="알림" message="테스트 메시지" isVisible onClose={onClose} />,
    )

    const closeButton = screen.getByRole('button')
    await user.click(closeButton)

    act(() => {
      jest.advanceTimersByTime(300)
    })
    expect(onClose).toHaveBeenCalled()
  })
})
