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