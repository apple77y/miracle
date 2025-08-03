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

// Mock document methods and properties
const mockDocument = {
  title: '',
  documentElement: {
    lang: ''
  },
  querySelector: jest.fn(),
  querySelectorAll: jest.fn()
}

// Setup DOM mocks for tests
// Don't override the entire document, just specific properties we need to mock
Object.defineProperty(global.document, 'querySelector', {
  value: mockDocument.querySelector,
  writable: true
})
Object.defineProperty(global.document, 'querySelectorAll', {
  value: mockDocument.querySelectorAll,
  writable: true
})
Object.defineProperty(global.document, 'documentElement', {
  value: mockDocument.documentElement,
  writable: true
})

// Mock meta elements
const createMockMetaElement = (content = '') => ({
  setAttribute: jest.fn(),
  getAttribute: jest.fn(() => content),
  content
})

const createMockScriptElement = (innerHTML = '') => ({
  innerHTML,
  textContent: innerHTML
})

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
    
    // Reset querySelector mock
    mockDocument.querySelector.mockImplementation((selector) => {
      if (selector === 'meta[name="description"]') {
        return createMockMetaElement()
      }
      if (selector === 'meta[property="og:title"]') {
        return createMockMetaElement()
      }
      if (selector === 'meta[property="og:description"]') {
        return createMockMetaElement()
      }
      if (selector === 'meta[property="og:locale"]') {
        return createMockMetaElement()
      }
      if (selector === 'script[type="application/ld+json"]') {
        return createMockScriptElement()
      }
      return null
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
    
    const mockMetaDescription = createMockMetaElement()
    mockDocument.querySelector.mockImplementation((selector) => {
      if (selector === 'meta[name="description"]') {
        return mockMetaDescription
      }
      return null
    })
    
    renderDynamicLayout()
    
    await waitFor(() => {
      expect(mockMetaDescription.setAttribute).toHaveBeenCalledWith(
        'content',
        '성남시 분당구에 위치한 미라클 플라워입니다. 신선하고 아름다운 꽃으로 특별한 순간을 만들어드립니다.'
      )
    }, { timeout: 500 })
  })

  it('should update meta description for English', async () => {
    localStorage.setItem('locale', 'en')
    
    const mockMetaDescription = createMockMetaElement()
    mockDocument.querySelector.mockImplementation((selector) => {
      if (selector === 'meta[name="description"]') {
        return mockMetaDescription
      }
      return null
    })
    
    renderDynamicLayout()
    
    await waitFor(() => {
      expect(mockMetaDescription.setAttribute).toHaveBeenCalledWith(
        'content',
        'Miracle Flower is located in Bundang-gu, Seongnam-si. We create special moments with fresh and beautiful flowers.'
      )
    }, { timeout: 200 })
  })

  it('should update OG title meta tag', async () => {
    // Ensure Korean locale
    localStorage.clear()
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'ko-KR'
    })
    
    const mockOgTitle = createMockMetaElement()
    mockDocument.querySelector.mockImplementation((selector) => {
      if (selector === 'meta[property="og:title"]') {
        return mockOgTitle
      }
      return null
    })
    
    renderDynamicLayout()
    
    await waitFor(() => {
      expect(mockOgTitle.setAttribute).toHaveBeenCalledWith(
        'content',
        "Miracle Flower - 미라클 플라워 | 성남 분당 꽃집"
      )
    }, { timeout: 500 })
  })

  it('should update OG description meta tag', async () => {
    // Ensure Korean locale
    localStorage.clear()
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'ko-KR'
    })
    
    const mockOgDescription = createMockMetaElement()
    mockDocument.querySelector.mockImplementation((selector) => {
      if (selector === 'meta[property="og:description"]') {
        return mockOgDescription
      }
      return null
    })
    
    renderDynamicLayout()
    
    await waitFor(() => {
      expect(mockOgDescription.setAttribute).toHaveBeenCalledWith(
        'content',
        '성남시 분당구에 위치한 미라클 플라워입니다. 신선하고 아름다운 꽃으로 특별한 순간을 만들어드립니다.'
      )
    }, { timeout: 500 })
  })

  it('should update OG locale meta tag for Korean', async () => {
    // Ensure Korean locale
    localStorage.clear()
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'ko-KR'
    })
    
    const mockOgLocale = createMockMetaElement()
    mockDocument.querySelector.mockImplementation((selector) => {
      if (selector === 'meta[property="og:locale"]') {
        return mockOgLocale
      }
      return null
    })
    
    renderDynamicLayout()
    
    await waitFor(() => {
      expect(mockOgLocale.setAttribute).toHaveBeenCalledWith('content', 'ko_KR')
    }, { timeout: 500 })
  })

  it('should update OG locale meta tag for English', async () => {
    localStorage.setItem('locale', 'en')
    
    const mockOgLocale = createMockMetaElement()
    mockDocument.querySelector.mockImplementation((selector) => {
      if (selector === 'meta[property="og:locale"]') {
        return mockOgLocale
      }
      return null
    })
    
    renderDynamicLayout()
    
    await waitFor(() => {
      expect(mockOgLocale.setAttribute).toHaveBeenCalledWith('content', 'en_US')
    }, { timeout: 200 })
  })

  it('should update JSON-LD script', async () => {
    // Ensure Korean locale
    localStorage.clear()
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'ko-KR'
    })
    
    const mockJsonLdScript = createMockScriptElement()
    mockDocument.querySelector.mockImplementation((selector) => {
      if (selector === 'script[type="application/ld+json"]') {
        return mockJsonLdScript
      }
      return null
    })
    
    renderDynamicLayout()
    
    await waitFor(() => {
      expect(mockJsonLdScript.innerHTML).toContain('미라클 플라워')
    }, { timeout: 500 })
  })

  it('should handle DOM manipulation errors gracefully', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    
    // Mock querySelector to throw error
    const originalQuerySelector = document.querySelector
    document.querySelector = jest.fn(() => {
      throw new Error('DOM error')
    })
    
    renderDynamicLayout()
    
    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('DOM update error:', expect.any(Error))
    }, { timeout: 500 })
    
    // Restore
    document.querySelector = originalQuerySelector
    consoleLogSpy.mockRestore()
  })

  it('should handle missing DOM elements gracefully', async () => {
    // Mock querySelector to return null for all elements
    mockDocument.querySelector.mockReturnValue(null)
    mockDocument.documentElement = null as unknown as HTMLElement
    
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