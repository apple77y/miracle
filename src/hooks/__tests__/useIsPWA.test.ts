import { renderHook, act } from '@testing-library/react'
import { useIsPWA } from '../useIsPWA'

// Mock window.matchMedia
const mockMatchMedia = (matches: boolean) => {
  return jest.fn().mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
}

// Mock navigator.standalone
const mockNavigatorStandalone = (standalone?: boolean) => {
  Object.defineProperty(window, 'navigator', {
    value: {
      ...window.navigator,
      standalone,
    },
    writable: true,
  })
}

describe('useIsPWA', () => {
  beforeEach(() => {
    // Reset mocks
    window.matchMedia = mockMatchMedia(false)
    mockNavigatorStandalone(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return false when not in PWA mode', () => {
    window.matchMedia = mockMatchMedia(false)
    mockNavigatorStandalone(undefined)

    const { result } = renderHook(() => useIsPWA())
    
    expect(result.current).toBe(false)
  })

  it('should return true when in standalone mode (Android PWA)', () => {
    window.matchMedia = jest.fn().mockImplementation((query) => {
      if (query === '(display-mode: standalone)') {
        return {
          matches: true,
          media: query,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        }
      }
      return {
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }
    })

    const { result } = renderHook(() => useIsPWA())
    
    expect(result.current).toBe(true)
  })

  it('should return true when navigator.standalone is true (iOS PWA)', () => {
    window.matchMedia = mockMatchMedia(false)
    mockNavigatorStandalone(true)

    const { result } = renderHook(() => useIsPWA())
    
    expect(result.current).toBe(true)
  })

  it('should return true when in fullscreen mode', () => {
    window.matchMedia = jest.fn().mockImplementation((query) => {
      if (query === '(display-mode: fullscreen)') {
        return {
          matches: true,
          media: query,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        }
      }
      return {
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }
    })

    const { result } = renderHook(() => useIsPWA())
    
    expect(result.current).toBe(true)
  })

  it('should return true when in minimal-ui mode', () => {
    window.matchMedia = jest.fn().mockImplementation((query) => {
      if (query === '(display-mode: minimal-ui)') {
        return {
          matches: true,
          media: query,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        }
      }
      return {
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }
    })

    const { result } = renderHook(() => useIsPWA())
    
    expect(result.current).toBe(true)
  })

  it('should add event listeners for display mode changes', () => {
    const mockAddEventListener = jest.fn()
    const mockRemoveEventListener = jest.fn()
    
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    }))

    const { unmount } = renderHook(() => useIsPWA())

    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))

    unmount()

    expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should update state when display mode changes', () => {
    let changeHandler: () => void = () => {}
    const mockAddEventListener = jest.fn((event, handler) => {
      if (event === 'change') {
        changeHandler = handler
      }
    })
    
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      addEventListener: mockAddEventListener,
      removeEventListener: jest.fn(),
    }))

    const { result } = renderHook(() => useIsPWA())
    
    expect(result.current).toBe(false)

    // Simulate display mode change to standalone
    window.matchMedia = jest.fn().mockImplementation((query) => {
      if (query === '(display-mode: standalone)') {
        return {
          matches: true,
          media: query,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        }
      }
      return {
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }
    })

    act(() => {
      changeHandler()
    })

    expect(result.current).toBe(true)
  })

  it('should handle server-side rendering safely', () => {
    // Mock window as undefined (server-side)
    const originalWindow = global.window
    // @ts-expect-error - Intentionally setting to undefined for SSR test
    delete global.window

    const { result } = renderHook(() => useIsPWA())
    
    expect(result.current).toBe(false)

    // Restore window
    global.window = originalWindow
  })
})