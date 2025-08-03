import React from 'react'
import { render, screen } from '@testing-library/react'
import PWALayout from '../PWALayout'
import I18nProvider from '../I18nProvider'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({ children, href, className, ...props }: {
    children?: React.ReactNode;
    href: string | object;
    className?: string;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
      <a href={typeof href === 'string' ? href : '#'} className={className} {...props}>
        {children}
      </a>
    )
  }
})

// Mock window.matchMedia for PWA detection
const createMockMatchMedia = (matches: boolean) => {
  return jest.fn().mockImplementation((query: string) => ({
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

const renderPWALayout = (children: React.ReactNode = <div>Test Content</div>) => {
  return render(
    <I18nProvider>
      <PWALayout>{children}</PWALayout>
    </I18nProvider>
  )
}

describe('PWALayout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock window and DOM methods for BottomNavigation
    window.addEventListener = jest.fn()
    window.removeEventListener = jest.fn()
    global.setInterval = jest.fn().mockReturnValue(123)
    global.clearInterval = jest.fn()
  })

  it('should render children content', () => {
    // Mock window.matchMedia to return false (not PWA mode)
    window.matchMedia = createMockMatchMedia(false)
    
    renderPWALayout(<div data-testid="test-content">Test Content</div>)
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should not add bottom padding when not in PWA mode', () => {
    // Mock window.matchMedia to return false (not PWA mode)
    window.matchMedia = createMockMatchMedia(false)
    
    const { container } = renderPWALayout(<div data-testid="test-content">Test Content</div>)
    
    // Find the PWALayout wrapper div - it should be empty class when not in PWA mode
    const pwaWrapperDiv = container.querySelector('div:not([class*="opacity"])')
    expect(pwaWrapperDiv).toBeInTheDocument()
    expect(pwaWrapperDiv?.className || '').toBe('')
  })

  it('should not show BottomNavigation when not in PWA mode', () => {
    // Mock window.matchMedia to return false (not PWA mode)
    window.matchMedia = createMockMatchMedia(false)
    
    renderPWALayout(<div>Test Content</div>)
    
    // BottomNavigation should not be present
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('should add bottom padding when in PWA mode', () => {
    // Mock window.matchMedia to return true (PWA mode)
    window.matchMedia = createMockMatchMedia(true)
    
    const { container } = renderPWALayout(<div data-testid="test-content">Test Content</div>)
    
    // Find the PWALayout wrapper div with pb-16 class
    const pwaWrapperDiv = container.querySelector('div.pb-16')
    expect(pwaWrapperDiv).toBeInTheDocument()
    expect(pwaWrapperDiv).toHaveClass('pb-16')
  })

  it('should show BottomNavigation when in PWA mode', () => {
    // Mock window.matchMedia to return true (PWA mode)
    window.matchMedia = createMockMatchMedia(true)
    
    renderPWALayout(<div>Test Content</div>)
    
    // BottomNavigation should be present
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    
    // Check for bottom navigation items
    expect(screen.getByText('홈')).toBeInTheDocument()
    expect(screen.getByText('꽃 관리')).toBeInTheDocument()
    expect(screen.getByText('이벤트')).toBeInTheDocument()
    expect(screen.getByText('문의')).toBeInTheDocument()
  })

  it('should render multiple children correctly', () => {
    // Mock window.matchMedia to return false (not PWA mode)
    window.matchMedia = createMockMatchMedia(false)
    
    renderPWALayout(
      <React.Fragment>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <span data-testid="child-3">Child 3</span>
      </React.Fragment>
    )
    
    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
    expect(screen.getByTestId('child-3')).toBeInTheDocument()
  })

  it('should maintain children content in PWA mode', () => {
    // Mock window.matchMedia to return true (PWA mode)
    window.matchMedia = createMockMatchMedia(true)
    
    renderPWALayout(
      <div data-testid="pwa-content">
        <h1>PWA Mode Content</h1>
        <p>This content should be visible in PWA mode</p>
      </div>
    )
    
    expect(screen.getByTestId('pwa-content')).toBeInTheDocument()
    expect(screen.getByText('PWA Mode Content')).toBeInTheDocument()
    expect(screen.getByText('This content should be visible in PWA mode')).toBeInTheDocument()
  })

  it('should handle complex nested children', () => {
    // Mock window.matchMedia to return true (PWA mode)
    window.matchMedia = createMockMatchMedia(true)
    
    renderPWALayout(
      <div>
        <header>Header Content</header>
        <main>
          <section>
            <h1>Main Content</h1>
            <article>
              <p>Article content</p>
            </article>
          </section>
        </main>
        <footer>Footer Content</footer>
      </div>
    )
    
    expect(screen.getByText('Header Content')).toBeInTheDocument()
    expect(screen.getByText('Main Content')).toBeInTheDocument()
    expect(screen.getByText('Article content')).toBeInTheDocument()
    expect(screen.getByText('Footer Content')).toBeInTheDocument()
    
    // Should also have bottom navigation in PWA mode
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('should have correct wrapper structure', () => {
    // Mock window.matchMedia to return false (not PWA mode)
    window.matchMedia = createMockMatchMedia(false)
    
    const { container } = renderPWALayout(<div>Test Content</div>)
    
    // Should have I18nProvider wrapper div and PWALayout wrapper div
    const allDivs = container.querySelectorAll('div')
    expect(allDivs.length).toBeGreaterThanOrEqual(2) // I18nProvider div + PWALayout div + content div
    
    // Content should be inside the wrapper
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should handle empty children gracefully', () => {
    // Mock window.matchMedia to return false (not PWA mode)
    window.matchMedia = createMockMatchMedia(false)
    
    const { container } = renderPWALayout(null)
    
    expect(container.firstChild).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('should handle undefined children gracefully', () => {
    // Mock window.matchMedia to return true (PWA mode)
    window.matchMedia = createMockMatchMedia(true)
    
    const { container } = renderPWALayout(undefined)
    
    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})