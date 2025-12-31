import '@testing-library/jest-dom'

// Configure React.act for React 19
import { configure } from '@testing-library/react'
configure({ testIdAttribute: 'data-testid' })

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0,
}
global.localStorage = localStorageMock

// Mock navigator.language
Object.defineProperty(navigator, 'language', {
  writable: true,
  value: 'ko-KR',
})

// Mock document.documentElement.lang
Object.defineProperty(document.documentElement, 'lang', {
  writable: true,
  value: 'ko',
})

// Mock Audio
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn(),
  load: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  volume: 0.5,
  currentTime: 0,
  readyState: 4,
}))

// Mock HTMLAudioElement
global.HTMLAudioElement = jest.fn().mockImplementation(() => {
  const mockAudio = {
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn(),
    load: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    volume: 0.5,
    currentTime: 0,
    readyState: 4,
    src: '',
    // Add basic HTMLElement properties
    nodeType: 1,
    nodeName: 'AUDIO',
    tagName: 'AUDIO',
    setAttribute: jest.fn(),
    getAttribute: jest.fn(),
    removeAttribute: jest.fn(),
    hasAttribute: jest.fn(),
    appendChild: jest.fn(),
    removeChild: jest.fn(),
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn(),
      toggle: jest.fn(),
    },
    style: {},
    dispatchEvent: jest.fn(),
    cloneNode: jest.fn(),
  }
  // Make properties writable
  Object.defineProperty(mockAudio, 'volume', { value: 0.5, writable: true })
  Object.defineProperty(mockAudio, 'currentTime', { value: 0, writable: true })
  Object.defineProperty(mockAudio, 'src', { value: '', writable: true })
  return mockAudio
})

// Patch jsdom's HTMLMediaElement prototype to avoid "Not implemented" errors during tests
if (typeof window !== 'undefined' && window.HTMLMediaElement && window.HTMLMediaElement.prototype) {
  const proto = window.HTMLMediaElement.prototype
  ;['play', 'pause', 'load'].forEach((fn) => {
    try {
      const existing = proto[fn]
      // If it's not a function or not already a jest mock, override with a mock
      if (typeof existing !== 'function' || !existing._isMockFunction) {
        Object.defineProperty(proto, fn, {
          configurable: true,
          writable: true,
          value: fn === 'play' ? jest.fn().mockResolvedValue(undefined) : jest.fn(),
        })
      }
    } catch (e) {
      // If defining fails for any reason, silently ignore to avoid breaking tests
      // but log to console for visibility during local development
      // eslint-disable-next-line no-console
      console.warn('Could not patch HTMLMediaElement prototype for', fn, e)
    }
  })
}

// As an extra fallback, ensure HTMLAudioElement.prototype methods are mocked directly
try {
  if (typeof window !== 'undefined' && window.HTMLAudioElement && window.HTMLAudioElement.prototype) {
    const proto = window.HTMLAudioElement.prototype
    ;['play', 'pause', 'load'].forEach((fn) => {
      try {
        // Only override if not already a mock
        if (typeof proto[fn] !== 'function' || !proto[fn]._isMockFunction) {
          Object.defineProperty(proto, fn, {
            configurable: true,
            writable: true,
            value: fn === 'play' ? jest.fn().mockResolvedValue(undefined) : jest.fn(),
          })
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Could not patch HTMLAudioElement.prototype for', fn, e)
      }
    })
  }
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('HTMLAudioElement prototype patch failed', e)
}

// Filter out specific known benign console.error messages to keep test output clean
const _origConsoleError = console.error.bind(console)
console.error = (...args) => {
  try {
    const first = args[0]
    const msg = typeof first === 'string' ? first : first && first.message ? first.message : ''
    if (typeof msg === 'string') {
      if (
        msg.includes('Not implemented: HTMLMediaElement.prototype') ||
        msg.includes('The current testing environment is not configured to support act') ||
        msg.includes('Auto-play failed, user interaction required')
      ) {
        return
      }
    }
  } catch (e) {
    // ignore
  }
  _origConsoleError(...args)
}

// Ensure we patch the actual prototype used by DOM-created <audio> elements
try {
  const sampleAudio = document.createElement('audio')
  const audioProto = Object.getPrototypeOf(sampleAudio)
  ;['play', 'pause', 'load'].forEach((fn) => {
    try {
      if (typeof audioProto[fn] !== 'function' || !audioProto[fn]._isMockFunction) {
        Object.defineProperty(audioProto, fn, {
          configurable: true,
          writable: true,
          value: fn === 'play' ? jest.fn().mockResolvedValue(undefined) : jest.fn(),
        })
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      _origConsoleError('Could not patch audio prototype for', fn, e)
    }
  })
} catch (e) {
  // eslint-disable-next-line no-console
  _origConsoleError('Audio prototype patch failed', e)
}
