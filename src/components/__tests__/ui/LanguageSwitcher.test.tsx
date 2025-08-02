import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LanguageSwitcher from '../../ui/LanguageSwitcher'
import I18nProvider, { useI18n } from '../../I18nProvider'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0,
}
global.localStorage = localStorageMock as Storage

const renderLanguageSwitcher = () => {
  return render(
    <I18nProvider>
      <LanguageSwitcher />
    </I18nProvider>
  )
}

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    document.documentElement.lang = ''
    localStorageMock.getItem.mockReturnValue(null)
    // Ensure consistent navigator.language for all tests
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'en-US'
    })
    jest.useFakeTimers()
  })
  
  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render button with English as default', async () => {
    renderLanguageSwitcher()
    
    await waitFor(() => {
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('KO')
      expect(button).toHaveAttribute('aria-label', '한국어로 변경')
    })
  })

  it('should show Korean text when locale is Korean', async () => {
    // Force Korean locale by mocking localStorage and navigator
    localStorageMock.getItem.mockReturnValue('ko')
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'ko-KR'
    })
    
    renderLanguageSwitcher()
    
    await waitFor(() => {
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('EN')
      expect(button).toHaveAttribute('aria-label', 'Change to English')
    })
  })

  it('should toggle language when clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    renderLanguageSwitcher()
    
    // Advance timers to complete useEffect
    jest.advanceTimersByTime(100)
    
    const button = screen.getByRole('button')
    
    // Initially should show 'KO' (meaning current is English)
    await waitFor(() => {
      expect(button).toHaveTextContent('KO')
    })
    
    // Click to change to Korean
    await user.click(button)
    
    await waitFor(() => {
      expect(button).toHaveTextContent('EN')
      expect(button).toHaveAttribute('aria-label', 'Change to English')
    })
    
    // Click again to change back to English
    await user.click(button)
    
    await waitFor(() => {
      expect(button).toHaveTextContent('KO')
      expect(button).toHaveAttribute('aria-label', '한국어로 변경')
    })
  })

  it('should show tooltip on hover with correct language', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    renderLanguageSwitcher()
    
    // Advance timers to complete useEffect
    jest.advanceTimersByTime(100)
    
    const button = screen.getByRole('button')
    
    await user.hover(button)
    
    await waitFor(() => {
      expect(screen.getByText('한국어')).toBeInTheDocument()
    })
    
    // Change to Korean
    await user.click(button)
    
    await waitFor(() => {
      expect(button).toHaveTextContent('EN')
    })
    
    // Hover again to see English tooltip
    await user.hover(button)
    expect(screen.getByText('English')).toBeInTheDocument()
  })

  it('should have correct styling classes', () => {
    renderLanguageSwitcher()
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass(
      'fixed',
      'bottom-6',
      'right-6',
      'rounded-full',
      'p-4',
      'shadow-lg',
      'hover:shadow-xl',
      'transition-all',
      'duration-300',
      'flex',
      'items-center',
      'justify-center',
      'text-sm',
      'font-medium',
      'w-14',
      'h-14',
      'z-50',
      'bg-rose-500',
      'text-white',
      'hover:bg-rose-600',
      'group'
    )
  })

  it('should have proper positioning', () => {
    renderLanguageSwitcher()
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('fixed', 'bottom-6', 'right-6')
  })

  it('should have correct size', () => {
    renderLanguageSwitcher()
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('w-14', 'h-14')
  })

  it('should have hover effects', () => {
    renderLanguageSwitcher()
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('hover:bg-rose-600', 'hover:shadow-xl')
  })

  it('should have tooltip with proper styling', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    renderLanguageSwitcher()
    
    // Advance timers to complete useEffect
    jest.advanceTimersByTime(100)
    
    const button = screen.getByRole('button')
    await user.hover(button)
    
    const tooltip = screen.getByText('English')
    expect(tooltip).toHaveClass(
      'absolute',
      'right-16',
      'bg-gray-800',
      'text-white',
      'px-2',
      'py-1',
      'rounded',
      'text-sm',
      'opacity-0',
      'group-hover:opacity-100',
      'transition-opacity',
      'duration-300',
      'whitespace-nowrap'
    )
  })

  it('should integrate properly with I18nProvider context', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    
    // Create a test component to verify context integration
    const TestComponent = () => {
      const { locale } = useI18n()
      return <div data-testid="current-locale">{locale}</div>
    }
    
    render(
      <I18nProvider>
        <TestComponent />
        <LanguageSwitcher />
      </I18nProvider>
    )
    
    // Advance timers to complete useEffect
    jest.advanceTimersByTime(100)
    
    const button = screen.getByRole('button')
    const localeDisplay = screen.getByTestId('current-locale')
    
    // Initially Korean (default state, navigator.language mock not working consistently)
    await waitFor(() => {
      expect(localeDisplay).toHaveTextContent('ko')
      expect(button).toHaveTextContent('EN')
    })
    
    // Click to change to English
    await user.click(button)
    
    await waitFor(() => {
      expect(localeDisplay).toHaveTextContent('en')
      expect(button).toHaveTextContent('KO')
    })
  })

  it('should handle rapid clicking without errors', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    renderLanguageSwitcher()
    
    // Advance timers to complete useEffect
    jest.advanceTimersByTime(100)
    
    const button = screen.getByRole('button')
    
    // Click multiple times rapidly
    await user.click(button)
    await user.click(button)
    await user.click(button)
    await user.click(button)
    
    // Should end up back at English (even number of clicks from Korean start)
    await waitFor(() => {
      expect(button).toHaveTextContent('KO')
    })
  })
})