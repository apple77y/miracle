import { render, screen, waitFor } from '@testing-library/react'
import DynamicLayout from '../DynamicLayout'
import I18nProvider from '../I18nProvider'

const renderDynamicLayout = (children: React.ReactNode = <div>Test Content</div>) => {
  return render(
    <I18nProvider>
      <DynamicLayout>
        {children}
      </DynamicLayout>
    </I18nProvider>
  )
}

// Helper to create script elements in the real document for tests
const createScript = (type = 'application/ld+json') => {
  const s = document.createElement('script')
  s.type = type
  document.head.appendChild(s)
  return s
}

describe('DynamicLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    document.title = ''
    if (document.documentElement) {
      document.documentElement.lang = ''
    }
    
    // Reset navigator language to Korean
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'ko-KR'
    })
  })

  it('should render children correctly', () => {
    renderDynamicLayout(<div data-testid="test-child">Test Child</div>)
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  it('should update document title for Korean locale', async () => {
    // Ensure Korean locale is set
    localStorage.clear()
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'ko-KR'
    })
    
    // Set up spy to capture title changes
    const titleSpy = jest.spyOn(document, 'title', 'set')
    
    renderDynamicLayout()
    
    await waitFor(() => {
      expect(titleSpy).toHaveBeenCalledWith("Miracle Flower - 미라클 플라워 | 성남 분당 꽃집")
    }, { timeout: 500 })
    
    titleSpy.mockRestore()
  })

  it('should update document title for English locale', async () => {
    // Set localStorage to English
    localStorage.setItem('locale', 'en')
    
    // Set up spy to capture title changes
    const titleSpy = jest.spyOn(document, 'title', 'set')
    
    renderDynamicLayout()
    
    await waitFor(() => {
      expect(titleSpy).toHaveBeenCalledWith("Miracle Flower | Premium Flower Shop in Bundang, Seongnam")
    }, { timeout: 500 })
    
    titleSpy.mockRestore()
  })

  it('should update HTML lang attribute', async () => {
    // Ensure Korean locale is set
    localStorage.clear()
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'ko-KR'
    })
    
    renderDynamicLayout()
    
    await waitFor(() => {
      expect(document.documentElement.lang).toBe('ko')
    }, { timeout: 500 })
  })

  it('should update meta description for Korean', async () => {
    // Ensure Korean locale
    localStorage.clear()
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'ko-KR'
    })
    
    renderDynamicLayout()

    await waitFor(() => {
      const liveMeta = document.querySelector('meta[name="description"]')
      expect(liveMeta?.getAttribute('content')).toBe('성남시 분당구에 위치한 미라클 플라워입니다. 신선하고 아름다운 꽃으로 특별한 순간을 만들어드립니다.')
    }, { timeout: 500 })
  })

  it('should update meta description for English', async () => {
    localStorage.setItem('locale', 'en')
    
    renderDynamicLayout()

    await waitFor(() => {
      const liveMeta = document.querySelector('meta[name="description"]')
      expect(liveMeta?.getAttribute('content')).toBe('Miracle Flower is located in Bundang-gu, Seongnam-si. We create special moments with fresh and beautiful flowers.')
    }, { timeout: 200 })
  })

  it('should update OG title meta tag', async () => {
    // Ensure Korean locale
    localStorage.clear()
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'ko-KR'
    })
    
    renderDynamicLayout()

    await waitFor(() => {
      const liveMeta = document.querySelector('meta[property="og:title"]')
      expect(liveMeta?.getAttribute('content')).toBe("Miracle Flower - 미라클 플라워 | 성남 분당 꽃집")
    }, { timeout: 500 })
  })

  it('should update OG description meta tag', async () => {
    // Ensure Korean locale
    localStorage.clear()
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'ko-KR'
    })
    
    renderDynamicLayout()

    await waitFor(() => {
      const liveMeta = document.querySelector('meta[property="og:description"]')
      expect(liveMeta?.getAttribute('content')).toBe('성남시 분당구에 위치한 미라클 플라워입니다. 신선하고 아름다운 꽃으로 특별한 순간을 만들어드립니다.')
    }, { timeout: 500 })
  })

  it('should update OG locale meta tag for Korean', async () => {
    // Ensure Korean locale
    localStorage.clear()
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'ko-KR'
    })
    
    renderDynamicLayout()

    await waitFor(() => {
      const liveMeta = document.querySelector('meta[property="og:locale"]')
      expect(liveMeta?.getAttribute('content')).toBe('ko_KR')
    }, { timeout: 500 })
  })

  it('should update OG locale meta tag for English', async () => {
    localStorage.setItem('locale', 'en')
    
    renderDynamicLayout()

    await waitFor(() => {
      const liveMeta = document.querySelector('meta[property="og:locale"]')
      expect(liveMeta?.getAttribute('content')).toBe('en_US')
    }, { timeout: 200 })
  })

  it('should update JSON-LD script', async () => {
    // Ensure Korean locale
    localStorage.clear()
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'ko-KR'
    })
    
    // Ensure script element exists
    createScript('application/ld+json')

    renderDynamicLayout()

    await waitFor(() => {
      const newScript = document.querySelector('script[type="application/ld+json"]')
      expect(newScript).toBeTruthy()
      expect(newScript?.textContent).toContain('미라클 플라워')
    }, { timeout: 500 })
  })

  it('should handle DOM manipulation errors gracefully', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    // Mock querySelector to throw error only for meta or script selectors to avoid breaking other libs
    const originalQuerySelector = document.querySelector.bind(document)
    const docTyped = document as unknown as { querySelector: (selector?: string | null) => Element | null }
    docTyped.querySelector = (selector?: string | null) => {
      if (typeof selector === 'string' && (selector.includes('meta') || selector.includes('script'))) {
        throw new Error('DOM error')
      }
      // call original with a string cast to satisfy types without using `any`
      return originalQuerySelector(selector as unknown as string)
    }

    renderDynamicLayout()

    await waitFor(() => {
      const called = (consoleLogSpy.mock.calls && consoleLogSpy.mock.calls.length > 0) || (consoleErrorSpy.mock.calls && consoleErrorSpy.mock.calls.length > 0)
      expect(called).toBe(true)
    }, { timeout: 500 })

    // Restore
    docTyped.querySelector = originalQuerySelector
     consoleLogSpy.mockRestore()
     consoleErrorSpy.mockRestore()
  })

  it('should handle missing DOM elements gracefully', async () => {
    // Ensure no relevant meta/script elements exist
    document.querySelectorAll('meta').forEach(m => m.remove())
    document.querySelectorAll('script[type="application/ld+json"]').forEach(s => s.remove())

    renderDynamicLayout()

    // Should not throw errors and still render children
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should cleanup timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
    const { unmount } = renderDynamicLayout()
    
    unmount()
    
    expect(clearTimeoutSpy).toHaveBeenCalled()
    
    clearTimeoutSpy.mockRestore()
  })

  it('should use requestAnimationFrame for DOM updates', async () => {
    const requestAnimationFrameSpy = jest.spyOn(global, 'requestAnimationFrame').mockImplementation((callback) => {
      setTimeout(callback, 0)
      return 1
    })
    
    renderDynamicLayout()
    
    await waitFor(() => {
      expect(requestAnimationFrameSpy).toHaveBeenCalled()
    }, { timeout: 500 })
    
    requestAnimationFrameSpy.mockRestore()
  })

  it('should delay DOM updates to avoid conflicts', async () => {
    jest.useFakeTimers()
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout')
    
    renderDynamicLayout()
    
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 100)
    
    setTimeoutSpy.mockRestore()
    jest.useRealTimers()
  })
})