import { checkPWAStatus, setupPWAChangeListener } from '../pwa'

describe('pwa utils', () => {
  it('checkPWAStatus returns false on server', () => {
    const originalWindow = global.window
    // @ts-expect-error test server env path
    delete global.window

    expect(checkPWAStatus()).toBe(false)
    global.window = originalWindow
  })

  it('checkPWAStatus returns true for iOS standalone', () => {
    Object.defineProperty(window.navigator, 'standalone', {
      configurable: true,
      value: true,
    })

    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }))

    expect(checkPWAStatus()).toBe(true)
  })

  it('setupPWAChangeListener subscribes and unsubscribes', () => {
    const addEventListener = jest.fn()
    const removeEventListener = jest.fn()

    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addEventListener,
      removeEventListener,
    }))

    const cb = jest.fn()
    const unsubscribe = setupPWAChangeListener(cb)

    expect(addEventListener).toHaveBeenCalledWith('change', cb)
    unsubscribe()
    expect(removeEventListener).toHaveBeenCalledWith('change', cb)
  })

  it('setupPWAChangeListener returns noop on server', () => {
    const originalWindow = global.window
    // @ts-expect-error test server env path
    delete global.window

    const unsubscribe = setupPWAChangeListener(() => {})
    expect(typeof unsubscribe).toBe('function')
    expect(() => unsubscribe()).not.toThrow()

    global.window = originalWindow
  })
})

