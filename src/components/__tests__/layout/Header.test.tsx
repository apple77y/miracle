import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IntlProvider } from 'react-intl'
import Header from '../../layout/Header'
import enMessages from '../../../../messages/en.json'

const renderHeader = () => {
  return render(
    <IntlProvider messages={enMessages} locale="en">
      <Header />
    </IntlProvider>
  )
}

describe('Header', () => {
  it('should render brand name correctly', () => {
    renderHeader()
    
    expect(screen.getByText('Miracle')).toBeInTheDocument()
    expect(screen.getByText('Flower')).toBeInTheDocument()
  })

  it('should render desktop navigation links', () => {
    renderHeader()
    
    // Check desktop navigation specifically
    const desktopNav = document.querySelector('nav.hidden')
    expect(desktopNav).toBeInTheDocument()
    expect(screen.getByText('Brand Story')).toBeInTheDocument()
    expect(screen.getByText('Services')).toBeInTheDocument()
    expect(screen.getByText('Portfolio')).toBeInTheDocument()
    expect(screen.getByText('Flower Care Guide')).toBeInTheDocument()
    expect(screen.getByText('Event Guide')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('should have correct navigation links href', () => {
    renderHeader()
    
    expect(screen.getByRole('link', { name: /miracle flower/i })).toHaveAttribute('href', '/')
    
    // Test desktop navigation links specifically
    const desktopNav = document.querySelector('nav.hidden')
    const brandStoryLink = desktopNav?.querySelector('a[href="/#about"]')
    const servicesLink = desktopNav?.querySelector('a[href="/#services"]')
    const portfolioLink = desktopNav?.querySelector('a[href="/#gallery"]')
    const flowerGuideLink = desktopNav?.querySelector('a[href="/guide"]')
    const eventGuideLink = desktopNav?.querySelector('a[href="/occasion"]')
    const contactLink = desktopNav?.querySelector('a[href="/#contact"]')
    
    expect(brandStoryLink).toHaveAttribute('href', '/#about')
    expect(servicesLink).toHaveAttribute('href', '/#services')
    expect(portfolioLink).toHaveAttribute('href', '/#gallery')
    expect(flowerGuideLink).toHaveAttribute('href', '/guide')
    expect(eventGuideLink).toHaveAttribute('href', '/occasion')
    expect(contactLink).toHaveAttribute('href', '/#contact')
  })

  it('should toggle mobile menu when hamburger button is clicked', async () => {
    const user = userEvent.setup()
    renderHeader()
    
    const menuButton = screen.getByRole('button', { name: '메뉴 열기' })
    expect(menuButton).toBeInTheDocument()
    
    // Mobile menu should not be visible initially
    expect(document.querySelector('.fixed.top-20')).not.toBeInTheDocument()
    
    // Click to open menu
    await user.click(menuButton)
    
    // Mobile menu should be visible
    await waitFor(() => {
      const mobileMenu = document.querySelector('.fixed.top-20')
      expect(mobileMenu).toBeInTheDocument()
    })
    
    // Click to close menu (button should show close icon now)
    await user.click(menuButton)
    
    // Mobile menu should be hidden
    await waitFor(() => {
      expect(document.querySelector('.fixed.top-20')).not.toBeInTheDocument()
    })
  })

  it('should close mobile menu when backdrop is clicked', async () => {
    const user = userEvent.setup()
    renderHeader()
    
    const menuButton = screen.getByRole('button', { name: '메뉴 열기' })
    
    // Open menu
    await user.click(menuButton)
    
    await waitFor(() => {
      const mobileMenu = document.querySelector('.fixed.top-20')
      expect(mobileMenu).toBeInTheDocument()
    })
    
    // Click backdrop
    const backdrop = document.querySelector('.fixed.inset-0')
    if (backdrop) {
      await user.click(backdrop as Element)
    }
    
    // Menu should be closed
    await waitFor(() => {
      expect(document.querySelector('.fixed.top-20')).not.toBeInTheDocument()
    })
  })

  it('should close mobile menu when a navigation link is clicked', async () => {
    const user = userEvent.setup()
    renderHeader()
    
    const menuButton = screen.getByRole('button', { name: '메뉴 열기' })
    
    // Open menu
    await user.click(menuButton)
    
    await waitFor(() => {
      const mobileMenu = document.querySelector('.fixed.top-20')
      expect(mobileMenu).toBeInTheDocument()
    })
    
    // Click a navigation link in mobile menu
    const mobileMenu = document.querySelector('.fixed.top-20')
    const mobileLink = mobileMenu?.querySelector('a[href="/#about"]')
    
    if (mobileLink) {
      await user.click(mobileLink as Element)
    }
    
    // Menu should be closed
    await waitFor(() => {
      expect(document.querySelector('.fixed.top-20')).not.toBeInTheDocument()
    })
  })

  it('should show hamburger icon when menu is closed and X icon when menu is open', async () => {
    const user = userEvent.setup()
    renderHeader()
    
    const menuButton = screen.getByRole('button', { name: '메뉴 열기' })
    
    // Should show hamburger icon initially
    const hamburgerIcon = menuButton.querySelector('path[d="M4 6h16M4 12h16M4 18h16"]')
    expect(hamburgerIcon).toBeInTheDocument()
    
    // Click to open menu
    await user.click(menuButton)
    
    // Should show X icon when menu is open
    await waitFor(() => {
      const closeIcon = menuButton.querySelector('path[d="M6 18L18 6M6 6l12 12"]')
      expect(closeIcon).toBeInTheDocument()
    })
  })

  it('should have proper styling classes', () => {
    renderHeader()
    
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('bg-white/95', 'backdrop-blur-sm', 'border-b', 'border-gray-100', 'sticky', 'top-0', 'z-50')
  })

  it('should have proper accessibility attributes', () => {
    renderHeader()
    
    const menuButton = screen.getByRole('button', { name: '메뉴 열기' })
    expect(menuButton).toHaveAttribute('aria-label', '메뉴 열기')
  })
})