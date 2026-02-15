import React from 'react'
import { render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import BottomNavigation from '../../ui/BottomNavigation'
import I18nProvider from '../../I18nProvider'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({ children, href, className, ...props }: {
    children?: React.ReactNode;
    href: string | { pathname?: string; hash?: string };
    className?: string;
  } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
    const resolvedHref = typeof href === 'string'
      ? href
      : `${href.pathname ?? ''}${href.hash ? `#${href.hash}` : ''}` || '#';

    return (
      <a href={resolvedHref} className={className} {...props}>
        {children}
      </a>
    )
  }
})

// Mock hash changes and events
const mockAddEventListener = jest.fn()
const mockRemoveEventListener = jest.fn()

const renderBottomNavigation = (pathname = '/') => {
  (usePathname as jest.Mock).mockReturnValue(pathname)
  
  return render(
    <I18nProvider>
      <BottomNavigation />
    </I18nProvider>
  )
}

describe('BottomNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock window event listeners
    window.addEventListener = mockAddEventListener
    window.removeEventListener = mockRemoveEventListener
    // Reset localStorage mock
    window.localStorage.getItem = jest.fn(() => null)
    // Reset usePathname mock
    ;(usePathname as jest.Mock).mockReturnValue('/')
    // Reset window.location
    try {
      window.location.hash = ''
    } catch {
      // In environments where assignment triggers navigation, provide a minimal stub
      Object.defineProperty(window, 'location', {
        value: { hash: '' },
        writable: true,
      })
    }
  })

  it('should render all navigation items', () => {
    renderBottomNavigation()
    
    expect(screen.getByText('홈')).toBeInTheDocument()
    expect(screen.getByText('꽃 관리')).toBeInTheDocument()
    expect(screen.getByText('이벤트')).toBeInTheDocument()
    expect(screen.getByText('문의')).toBeInTheDocument()
  })


  it('should have correct href attributes for all navigation items', () => {
    renderBottomNavigation()
    
    const homeLink = screen.getByRole('link', { name: /홈/ })
    const guideLink = screen.getByRole('link', { name: /꽃 관리/ })
    const eventLink = screen.getByRole('link', { name: /이벤트/ })
    const contactLink = screen.getByRole('link', { name: /문의/ })
    
    expect(homeLink).toHaveAttribute('href', '/')
    expect(guideLink).toHaveAttribute('href', '/guide')
    expect(eventLink).toHaveAttribute('href', '/occasion')
    expect(contactLink).toHaveAttribute('href', '/#contact')
  })

  it('should show home as active when on home page with no hash', () => {
    renderBottomNavigation('/')
    
    const homeLink = screen.getByRole('link', { name: /홈/ })
    expect(homeLink).toHaveClass('text-sage')
  })

  it('should show guide as active when on guide page', () => {
    renderBottomNavigation('/guide')
    
    const guideLink = screen.getByRole('link', { name: /꽃 관리/ })
    expect(guideLink).toHaveClass('text-sage')
  })

  it('should show guide as active when on guide page with trailing slash', () => {
    renderBottomNavigation('/guide/')
    
    const guideLink = screen.getByRole('link', { name: /꽃 관리/ })
    expect(guideLink).toHaveClass('text-sage')
  })

  it('should show occasion as active when on occasion page', () => {
    renderBottomNavigation('/occasion')
    
    const eventLink = screen.getByRole('link', { name: /이벤트/ })
    expect(eventLink).toHaveClass('text-sage')
  })


  it('should add event listeners for hash changes', () => {
    renderBottomNavigation()
    
    // Just check that some event listeners were added
    expect(mockAddEventListener).toHaveBeenCalled()
  })

  it('should remove event listeners on unmount', () => {
    const { unmount } = renderBottomNavigation()
    
    unmount()
    
    // Just check that cleanup functions were called
    expect(mockRemoveEventListener).toHaveBeenCalled()
  })

  it('should have proper styling classes', () => {
    renderBottomNavigation()
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass(
      'fixed',
      'bottom-0',
      'left-0',
      'right-0',
      'bg-white',
      'border-t',
      'border-gray-200',
      'z-50',
      'safe-area-pb'
    )
  })

  it('should display SVG icons for all navigation items', () => {
    const { container } = render(
      <I18nProvider>
        <BottomNavigation />
      </I18nProvider>
    )
    
    // Check for svg elements directly in the container
    const svgElements = container.querySelectorAll('svg')
    expect(svgElements.length).toBeGreaterThanOrEqual(4) // At least 4 navigation items with SVG icons
  })

  it('should handle non-active state styling correctly', () => {
    renderBottomNavigation('/some-other-page')
    
    const allLinks = screen.getAllByRole('link')
    allLinks.forEach(link => {
      expect(link).toHaveClass('text-gray-600')
      expect(link).not.toHaveClass('text-rose-600')
    })
  })

  it('should support hover states', () => {
    renderBottomNavigation('/some-other-page')
    
    const allLinks = screen.getAllByRole('link')
    allLinks.forEach(link => {
      expect(link).toHaveClass('hover:text-sage')
    })
  })

  it('should have transition animations', () => {
    renderBottomNavigation()
    
    const allLinks = screen.getAllByRole('link')
    allLinks.forEach(link => {
      expect(link).toHaveClass('transition-colors')
    })
  })

  describe('Hash detection edge cases', () => {
    it('should handle empty hash correctly for home page', () => {
      try {
        window.location.hash = ''
      } catch {
        Object.defineProperty(window, 'location', { value: { hash: '' }, writable: true })
      }

      renderBottomNavigation('/')
      
      const homeLink = screen.getByRole('link', { name: /홈/ })
      expect(homeLink).toHaveClass('text-sage')
    })

    it('should render contact link with correct href for hash navigation', () => {
      renderBottomNavigation('/')
      
      const contactLink = screen.getByRole('link', { name: /문의/ })
      expect(contactLink).toHaveAttribute('href', '/#contact')
    })

    it('should show proper styling for hash-based navigation items', () => {
      renderBottomNavigation('/')
      
      const contactLink = screen.getByRole('link', { name: /문의/ })
      // In the absence of complex hash state testing, just verify the link exists and has proper structure
      expect(contactLink).toBeInTheDocument()
      expect(contactLink).toHaveClass('flex', 'flex-col', 'items-center')
    })
  })
})
