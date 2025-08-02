import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import I18nProvider, { useI18n } from '../I18nProvider'

// Test component to access I18n context
const TestComponent = () => {
  const { locale, setLocale } = useI18n()
  return (
    <div>
      <span data-testid="current-locale">{locale}</span>
      <button 
        data-testid="change-to-en" 
        onClick={() => setLocale('en')}
      >
        Change to English
      </button>
      <button 
        data-testid="change-to-ko" 
        onClick={() => setLocale('ko')}
      >
        Change to Korean
      </button>
    </div>
  )
}

// Mock navigator.language
Object.defineProperty(navigator, 'language', {
  writable: true,
  value: 'ko-KR'
})

describe('I18nProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    // Reset document language
    document.documentElement.lang = ''
  })

  it('should render children with default korean locale', async () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('current-locale')).toHaveTextContent('ko')
    })
  })

  it('should initialize with saved locale from localStorage', async () => {
    localStorage.setItem('locale', 'en')
    
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('current-locale')).toHaveTextContent('en')
    })
  })

  it('should change locale when setLocale is called', async () => {
    const user = userEvent.setup()
    
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    )

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByTestId('current-locale')).toHaveTextContent('ko')
    })

    // Change to English
    await user.click(screen.getByTestId('change-to-en'))
    
    await waitFor(() => {
      expect(screen.getByTestId('current-locale')).toHaveTextContent('en')
    })

    // Change back to Korean
    await user.click(screen.getByTestId('change-to-ko'))
    
    await waitFor(() => {
      expect(screen.getByTestId('current-locale')).toHaveTextContent('ko')
    })
  })

  it('should save locale to localStorage when changed', async () => {
    const user = userEvent.setup()
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')
    
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    )

    await user.click(screen.getByTestId('change-to-en'))
    
    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith('locale', 'en')
    })
    
    setItemSpy.mockRestore()
  })

  it('should update document language attribute when locale changes', async () => {
    const user = userEvent.setup()
    
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    )

    await user.click(screen.getByTestId('change-to-en'))
    
    // Wait for setTimeout to execute
    await waitFor(() => {
      expect(document.documentElement.lang).toBe('en')
    }, { timeout: 100 })
  })

  it('should detect English browser language and set locale accordingly', async () => {
    // Mock English browser language
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'en-US'
    })
    
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('current-locale')).toHaveTextContent('en')
    })
  })

  it('should throw error when useI18n is used outside provider', () => {
    // Mock console.error to avoid error output in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    const TestComponentOutsideProvider = () => {
      useI18n()
      return <div>Test</div>
    }

    expect(() => {
      render(<TestComponentOutsideProvider />)
    }).toThrow('useI18n must be used within I18nProvider')
    
    consoleSpy.mockRestore()
  })

  it('should handle localStorage errors gracefully', async () => {
    const user = userEvent.setup()
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })
    
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    )

    await user.click(screen.getByTestId('change-to-en'))
    
    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('Locale update error:', expect.any(Error))
    })
    
    consoleLogSpy.mockRestore()
    setItemSpy.mockRestore()
  })

  it('should have opacity transition for hydration', () => {
    render(
      <I18nProvider>
        <div data-testid="content">Test content</div>
      </I18nProvider>
    )

    const wrapper = screen.getByTestId('content').parentElement
    expect(wrapper).toHaveClass('opacity-100')
    expect(wrapper).toHaveStyle('transition: opacity 0.1s')
  })
})